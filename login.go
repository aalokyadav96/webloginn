package main

import (
    "bytes"
    "encoding/gob"
    "encoding/hex"
    "errors"
    "fmt"
    "log"
    "net/http"
    "strings"
	"time"

    "passport/internal/cookies"
	"github.com/golang-jwt/jwt/v5"
	"github.com/julienschmidt/httprouter"
)


var secretKey = []byte("secret-key")
var indexpage = `<!DOCTYPE HTML><html><body><div id="root"></div></body></html>`
var loginpage = `<form action="/login" method="POST"><input type="text" name="username"/><input type="text" name="password"/><input type="submit"/></form>`
var head = `<!DOCTYPE HTML><html><head><link  loading="lazy" rel="stylesheet" href="/static/main.css"><script src="/static/main.js" type="module"  async></script></head><body>`
var footer = `</body></html>`

func main() {
    gob.Register(&User{})
    var err error
    secret, err = hex.DecodeString("13d6b4dff8f84a10851021ec8608f814570d562c92fe6b5ec4c9f595bcb3234b")
    if err != nil {
        log.Fatal(err)
    }

	router := httprouter.New()
	router.GET("/", Index)
	router.GET("/favicon.ico", Index)
	router.GET("/login",Login)
	router.POST("/login",Login)
	router.GET("/signup",registerHandler)
	router.POST("/signup",registerHandler)
    //~ router.GET("/set", setCookieHandler)
    router.GET("/get", getCookieHandler)
    router.DELETE("/logout", Logout)
    router.GET("/wet", clearSession)
	static := httprouter.New()
	router.ServeFiles("/static/*filepath", http.Dir("static"))
	router.NotFound = static

    log.Print("Listening...")
    err = http.ListenAndServe(":4000", router)
    if err != nil {
        log.Fatal(err)
    }
}


func Index(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	fmt.Fprintf(w,head+indexpage+footer)
}


func registerHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	switch r.Method {
	case "POST" : 
		username := r.FormValue("username")
		password := r.FormValue("password")
		fmt.Println(username, "  " ,password)
		fmt.Fprintf(w,"200")
	default:
		fmt.Fprintf(w,"404")
	}
}


func Login(w http.ResponseWriter, r *http.Request, a httprouter.Params) {
	switch r.Method {
		case "POST" : {
			un := r.FormValue("username")
			pw := r.FormValue("password")
			tok := createToken(un)
			fmt.Println(tok)
			fmt.Println(un)
			fmt.Println(pw)
			setCookieHandler(w, r,a)
			fmt.Fprintf(w,tok)
		}
		case "GET" : {
			clearSession(w,r,a)
			fmt.Fprintf(w,head+loginpage+footer)
		}
	}
}


func Logout(w http.ResponseWriter, r *http.Request, a httprouter.Params) {
	    cookie := http.Cookie{
        Name:     "exampleCookie",
        Value:    "",
        Path:     "/",
        MaxAge:   -1,
        HttpOnly: true,
        Secure:   true,
        SameSite: http.SameSiteLaxMode,
    }
    err := cookies.Write(w, cookie)
    if err != nil {
        log.Println(err)
        http.Error(w, "server error", http.StatusInternalServerError)
        return
    }
	fmt.Fprintf(w,indexpage)
}


func createToken(username string) string {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, 
        jwt.MapClaims{ 
        "username": username, 
        "exp": time.Now().Add(time.Hour * 24).Unix(), 
        })

    tokenString, err := token.SignedString(secretKey)
    if err != nil {
    return ""
    }

 return tokenString
}


//~ func webtoken(w http.ResponseWriter, r *http.Request) {
	//~ enableCors(&w)

	//~ switch r.Method {
		//~ case "GET" : {
			//~ fmt.Println("Webstoken")
			//~ fmt.Fprintf(w,"toketoketoken")
		//~ }
		//~ case "POST" : {
			//~ http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			//~ return
	//~ }
		//~ case "OPTIONS" : {
			//~ fmt.Fprintf(w,"200")
			//~ return
	//~ } 
	//~ }
//~ }


//~ func enableCors(w *http.ResponseWriter) {
	//~ (*w).Header().Set("Access-Control-Allow-Origin", "*")
	//~ (*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	//~ (*w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
//~ }

var secret []byte

// Declare the User type.
type User struct {
    Name string
    Age  int
}


func setCookieHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    user := User{Name: "Alice", Age: 21}
    var buf bytes.Buffer
    err := gob.NewEncoder(&buf).Encode(&user)
    if err != nil {
        log.Println(err)
        http.Error(w, "server error", http.StatusInternalServerError)
        return
    }
    cookie := http.Cookie{
        Name:     "exampleCookie",
        Value:    buf.String(),
        Path:     "/",
        MaxAge:   3600,
        HttpOnly: true,
        Secure:   true,
        SameSite: http.SameSiteLaxMode,
    }
    err = cookies.WriteEncrypted(w, cookie, secret)
    if err != nil {
        log.Println(err)
        http.Error(w, "server error", http.StatusInternalServerError)
        return
    }
    //~ w.Write([]byte("cookie set!"))
}

func getCookieHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    // Read the gob-encoded value from the encrypted cookie, handling any errors
    // as necessary.
    gobEncodedValue, err := cookies.ReadEncrypted(r, "exampleCookie", secret)
    if err != nil {
        switch {
        case errors.Is(err, http.ErrNoCookie):
            http.Error(w, "cookie not found", http.StatusBadRequest)
        case errors.Is(err, cookies.ErrInvalidValue):
            http.Error(w, "invalid cookie", http.StatusBadRequest)
        default:
            log.Println(err)
            http.Error(w, "server error", http.StatusInternalServerError)
        }
        return
    }

    // Create a new instance of a User type.
    var user User

    // Create an strings.Reader containing the gob-encoded value.
    reader := strings.NewReader(gobEncodedValue)

    // Decode it into the User type. Notice that we need to pass a *pointer* to
    // the Decode() target here?
    if err := gob.NewDecoder(reader).Decode(&user); err != nil {
        log.Println(err)
        http.Error(w, "server error", http.StatusInternalServerError)
        return
    }

    // Print the user information in the response.
    fmt.Fprintf(w, "Name: %q\n", user.Name)
    fmt.Fprintf(w, "Age: %d\n", user.Age)
}

func clearSession(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
    cookie := http.Cookie{
        Name:     "exampleCookie",
        Value:    "",
        Path:     "/",
        MaxAge:   -1,
        HttpOnly: true,
        Secure:   true,
        SameSite: http.SameSiteLaxMode,
    }
    http.SetCookie(w, &cookie)
	return
    w.Write([]byte("cookie out!"))
}

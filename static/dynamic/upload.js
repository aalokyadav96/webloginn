async function uploadMultiple(formData) {
  try {
    const response = await fetch("//localhost:4173/up", {
      method: "POST",
      body: formData,
    });
    const result = await response.text();
    console.log("Success:", result);
	const obj = JSON.parse(result);
	document.getElementById("demo").innerHTML = obj.postname + ", " + obj.postcount;
	renderPixcs(obj.postname,obj.postcount);
	//~ afterUpload(result);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function setClass(ul,count) {
	console.log(count);
	switch (count) {
		case 1 : {
			ul.setAttribute('class',"PostPreviewImageView_preview_image_wrap__Q29V8 PostPreviewImageView_-artist__WkyUA PostPreviewImageView_-bottom_radius__Mmn-- PostPreviewImageView_-one__-6MMx");
			break;
		}
		case 2 : {
			ul.setAttribute('class',"PostPreviewImageView_preview_image_wrap__Q29V8 PostPreviewImageView_-artist__WkyUA PostPreviewImageView_-bottom_radius__Mmn-- PostPreviewImageView_-two__WP8GL");
			break;
		}
		case 3 : {
			ul.setAttribute('class',"PostPreviewImageView_preview_image_wrap__Q29V8 PostPreviewImageView_-artist__WkyUA PostPreviewImageView_-bottom_radius__Mmn-- PostPreviewImageView_-three__HLsVN");
			break;
		}
		case 4 : {
			ul.setAttribute('class',"PostPreviewImageView_preview_image_wrap__Q29V8 PostPreviewImageView_-artist__WkyUA PostPreviewImageView_-bottom_radius__Mmn-- PostPreviewImageView_-four__fYIRN");
			break;
		}
		case 5 : {
			ul.setAttribute('class',"PostPreviewImageView_preview_image_wrap__Q29V8 PostPreviewImageView_-artist__WkyUA PostPreviewImageView_-bottom_radius__Mmn-- PostPreviewImageView_-five__RZvWx");
			break;
		}
		case 6 : {
			ul.setAttribute('class',"PostPreviewImageView_preview_image_wrap__Q29V8 PostPreviewImageView_-artist__WkyUA PostPreviewImageView_-bottom_radius__Mmn-- PostPreviewImageView_-six__Ds3aG");
			break;
		}
		case 7 : {
			ul.setAttribute('class',"PostPreviewImageView_preview_image_wrap__Q29V8 PostPreviewImageView_-artist__WkyUA PostPreviewImageView_-bottom_radius__Mmn-- PostPreviewImageView_-seven__65gnj");
			break;
		}
		case 8 : {
			ul.setAttribute('class',"PostPreviewImageView_preview_image_wrap__Q29V8 PostPreviewImageView_-artist__WkyUA PostPreviewImageView_-bottom_radius__Mmn-- PostPreviewImageView_-eight__SoycA");
			break;
		}
	}
}

function renderPixcs(postname, count) {
	var ul = document.getElementById('pics');
	ul.innerHTML = "";
	setClass(ul, count);
	for(var i=0;i<count;i++){
		var li = document.createElement('li');
		li.setAttribute('class',"PostPreviewImageView_image_item__dzD2P");
		var img = document.createElement('img');
		img.setAttribute('class',"PostPreviewImageView_post_image__zLzXH");
		img.src = "//localhost:4173/image/" + postname + "_" + (i+1) + ".png";
		li.appendChild(img);
		ul.appendChild(li);
	}
};

function createBody() {
	let html = ``
	html += `<form><input id="inptfile" type="file" accept="image/*" multiple  required /><br><div id='upbtn' onclick="uploadnow();" style="display:none;width:4rem;height:4rem;background:#ccc;">Upload</div></form><div class="FeedArtistLayoutView_main__r0yQj artist"><div style="aspect-ratio: 706.99 / 588.89; content-visibility: auto; contain-intrinsic-size: 706.99px 588.89px;"><ul id="pics"></ul></div></div>`;
	document.getElementById("main").innerHTML = html;
document.getElementById("inptfile").addEventListener("change", myFunction);
}

/*
<ul class="PostPreviewImageView_preview_image_wrap__Q29V8 PostPreviewImageView_-artist__WkyUA PostPreviewImageView_-bottom_radius__Mmn-- PostPreviewImageView_-two__WP8GL">
	<li class="PostPreviewImageView_image_item__dzD2P">
		<img src="https://phinf.wevpstatic." class="PostPreviewImageView_post_image__zLzXH" alt="">
	</li>
	<li class="PostPreviewImageView_image_item__dzD2P">
		<img src="https://phinf.wevpstatic." class="PostPreviewImageView_post_image__zLzXH" alt="">
	</li>
</ul>
*/



function myFunction() {
		//~ var x = document.getElementById("fname");
		//~ x.value = x.value.toUpperCase();
		document.getElementById('upbtn').style.display = "block";
	}

async function uploadnow() {
	document.getElementById('upbtn').style.display = "none";
	const formData = new FormData();
	const fileField = document.querySelector('input[type="file"][multiple]');
	//formData.append("key", "whatever");
	//~ formData.append("file", fileField.files[0]);
	for (const [i, photo] of Array.from(fileField.files).entries()) {
		formData.append(`file`, photo);
	}
	const xhr = new XMLHttpRequest();
	xhr.open("GET", "//localhost:4173/csrf", true);
	xhr.onload = () => {
		formData.append("csrftoken", xhr.responseText);
		uploadMultiple(formData);
	};
	xhr.send(null);
}


function afterUpload(name) {
	document.getElementById("demo").innerHTML = name;
}

/*

async function setClass(ul,count) {
	switch (count) {
		case 1 : {
			ul.classList.add("PostPreviewImageView_-one__-6MMx");
		}
		case 2 : {
			ul.classList.add("PostPreviewImageView_-two__WP8GL");
		}
		case 3 : {
			ul.classList.add("PostPreviewImageView_-three__HLsVN");
		}
		case 4 : {
			ul.classList.add("PostPreviewImageView_-four__fYIRN");
		}
		case 5 : {
			ul.classList.add("PostPreviewImageView_-five__RZvWx");
		}
		case 6 : {
			ul.classList.add("PostPreviewImageView_-six__Ds3aG");
		}
		case 7 : {
			ul.classList.add("PostPreviewImageView_-seven__65gnj");
		}
		case 8 : {
			ul.classList.add("PostPreviewImageView_-eight__SoycA");
		}
	}
}

*/
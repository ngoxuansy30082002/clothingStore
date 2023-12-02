var currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

const btnLike = $("#btn-blog-like");
$(document).ready(() => {

    btnLike.click((e) => {
        console.log(btnLike)
    })

})

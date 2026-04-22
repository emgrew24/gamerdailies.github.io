


// Display add image options when checkbox is checked
document.getElementById('chkAddImage').addEventListener('click', ()=>{
    const addImage = document.getElementById('addImage')
    const addImageAlt = document.getElementById('addImageAlt')

    if(chkAddImage.checked){
        addImage.classList.add('visible');
        addImageAlt.classList.add('visible');
    }
    else{
        addImage.classList.remove('visible');
        addImageAlt.classList.remove('visible');
    }

})



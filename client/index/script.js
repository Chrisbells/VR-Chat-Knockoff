let modelUrls = {
    "fox": "https://poly.google.com/view/10u8FYPC5Br",
    "shark": "https://poly.google.com/view/2xYwaBltA2c",
    "thawk": "https://poly.google.com/view/5FiM3rfkRsV",    
    "knuckles": "https://poly.google.com/view/6qpUkLPLCIR",
    "alien": "https://poly.google.com/view/2tuhk-qoHng",
    "cab": "https://poly.google.com/view/8V0uzZMZTsr"
}
models=document.querySelectorAll('.player')
models.forEach(model => {
   model.addEventListener('click',e=>{
    console.log(model.id)    
    let name=document.querySelector('input').value
       let modelUrl=modelUrls[model.id]
       let currentUrl=window.location.href
       currentUrl+=`chat?name=${name}&model=${modelUrl}`
       window.location.href=currentUrl
    }) 
});
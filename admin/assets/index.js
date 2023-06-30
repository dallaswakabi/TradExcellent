if(window.location.pathname == "/"){
    const del= document.querySelector(".delete")
    del.addEventListener('click',function(){
        const id =$(this).attr("data-id")
        console.log('')
    })
        
        const request = {
            "url":`http:http://localhost:3000/admin/${id}`,
            "method":"DELETE"
        }
     if(confirm("Do you really want to delete this record?")){
         $.ajax(request).done(function(response){
             alert("data deleted successfully");
         })
    }

}
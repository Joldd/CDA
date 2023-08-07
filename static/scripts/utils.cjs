document.querySelector("#Disconnect").addEventListener("click", () => {
    
  });

function disconnect(){
    req.session.user = null;
    res.redirect('index.html.twig');
}
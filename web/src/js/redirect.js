function redirectUser() {
  alert('Seu navegador não é compatível com a versão atual do Matrusp! Você será redirecionado a versão antiga. Recomendamos atualizar');
  location.href = "https://bcc.ime.usp.br/matrusp_v1";
}

if(!('Worker' in window && 'indexedDB' in window)) {
  redirectUser();
}

try { eval('() => {}'); }
catch(e) { redirectUser(); }
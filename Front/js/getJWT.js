function getProtectedResource() 
{
    const token = localStorage.getItem('authToken');

    axios.get('http://localhost:3000/protected', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log('受保護的資源:', response.data);
    })
    .catch(error => {
      console.error('無法取得受保護的資源', error.response.data.message);
    });
}
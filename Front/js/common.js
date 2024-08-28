function getHeaders() {
    const token = localStorage.getItem('authToken')
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
    return headers
}

function sqlDateToYearMonthDay(sqlDate) {
    const dateObject = new Date(sqlDate);
    const year = dateObject.getFullYear(); // 2024
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // 08 (月份從 0 開始，所以要 +1)
    const day = dateObject.getDate().toString().padStart(2, '0'); // 10
    const datePart = `${year}-${month}-${day}`;
    return datePart
}
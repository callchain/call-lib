function hexToStringWide(h) {//16进制转中英文
    let a = [];
    let i = 0;
    if (h.length % 4) {
        a.push(String.fromCharCode(parseInt(h.substring(0, 4), 16)));
        i = 4;
    }
    for (; i<h.length; i+=4) {
        a.push(String.fromCharCode(parseInt(h.substring(i, i+4), 16)));
    }
    return a.join('');
}

function getAccountInvoices(address: string) {
    const request = {
        command: 'account_invoices',
        account: address,
    };
    return this.connection.request(request).then(function (response) {
        return response;
    });
}
export default getAccountInvoices
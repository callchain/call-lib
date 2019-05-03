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

function getAccountIssues(address: string) {
    const request = {
        command: 'account_issues',
        account: address,
    };
    return this.connection.request(request).then(function (response) {
        if(response.NickName){
            response.nickName = hexToStringWide(hexToStringWide(response.NickName));
            delete response.NickName;
        }
        return response;
    });
}
export default getAccountIssues

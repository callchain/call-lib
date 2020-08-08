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

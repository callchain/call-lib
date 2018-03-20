function getAccountIssues(address: string) {
    const request = {
        command: 'account_issues',
        account: address,
    };
    return this.connection.request(request);
}
export default getAccountIssues

enum Route {
    Home = '/',
    Login = '/login',
    Register = '/register',
    Google = '/oauth-redirect',
    Dashboard= '/dashboard',
    PublicApi = '/public-api',
    GetAllUsers = '/get-all-users',
    Contact = '/contact',
    Immovables = '/immovables',
    ForgotPassword = '/forgot-password',
    EmailSendConfirmation = '/email-send-confirmation',
    ResetPassword = '/reset_password',
    ErrorEmailNotFound = '/error-email-not-found',
    NewProperty = '/new-property',
    EditProperty = '/edit-property',
    AddOwner= '/add-owner',
    AddTenant= '/add-tenant',
    EditOwner='/owner/edit/:id',
}

export {Route}
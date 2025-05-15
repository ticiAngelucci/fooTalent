enum Route {
    Home = '/',
    Login = '/login',
    Register = '/register',
    Google = '/oauth-redirect',
    Dashboard = '/dashboard',
    PublicApi = '/public-api',
    GetAllUsers = '/get-all-users',
    Contact = '/contact',
    Immovables = '/immovables',
    ForgotPassword = '/forgot-password',
    EmailSentRegister = '/email-sent-register',
    EmailSendConfirmation = '/email-send-confirmation',
    ResetPassword = '/reset_password',
    ErrorEmailNotFound = '/error-email-not-found',
    NewProperty = '/new-property',
    EditProperty = '/edit-property',
    AddOwner = '/add-owner',
    AddTenant = '/add-tenant',
    EditOwner = '/owner/edit/:id',
    EditTenant = '/tenant/edit/:id',
    Profile = '/profile',
    Payments = '/payments',
    NewPayment = '/payments/new'

}

export { Route }
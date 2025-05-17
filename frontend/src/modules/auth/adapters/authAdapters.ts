interface FormValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  interface RegisterPayload {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export const adaptRegisterData = (data: FormValues): RegisterPayload => {
    const { name, email, password, confirmPassword } = data;
    return {
      username: name,
      email,
      password,
      confirmPassword
    };
  };
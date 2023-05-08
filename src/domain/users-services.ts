
export type User = {
    id: string
    login: string
    email: string
    password: string
}


export const usersServices = {
    async createUser(login: string, email: string, password: string) {
        const newUser = {
            id: new Date().toISOString(),
            login,
            email,
            password
        }


    }
}
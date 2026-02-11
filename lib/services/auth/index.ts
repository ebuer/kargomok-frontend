import axios from "axios"

export const example = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/example`)
    return response.data
}
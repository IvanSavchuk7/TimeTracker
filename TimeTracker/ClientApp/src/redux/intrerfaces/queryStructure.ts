export interface QueryStructure<T> {
    data: T,
    errors: ResponseError[] | null,
    extensions: { count: number }
}

export interface ResponseError {
    message: string,
    extensions: {
        code: string,
        details: string
    }
}
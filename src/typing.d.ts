export interface UrlsState {
    full: string
    raw: string
    regular: string
    small: string
    small_s3: string
    thumb: string
}

export interface UserState {
    first_name: string
    last_name: string
    username: string
}

export interface PhotosState {
    id: string
    blur_hash: string
    color: string
    width: number
    height: number
    urls: UrlsState
    user: UserState
}



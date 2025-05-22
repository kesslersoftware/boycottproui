// User table
export type User = {
    user_id: string
    email_addr: string
    username: string
    passwordHash: string
}

// Company table
export type Company = {
    company_id: string
    company_name: string
    boycott_count: number
}

// Cause table
export type Cause = {
    cause_id: string
    cause_desc: string
    follower_count: number
}

// User boycotts table
export type UserBoycott = {
    user_id: string
    company_id: string
    cause_id: string | null
    personal_reason: string | null
    timestamp: string | null
}

// Cause-company stats table
export type CauseCompanyStat = {
    cause_id: string
    company_id: string
    boycott_count: number
}

// User-causes table
export type UserCause = {
    user_id: string
    cause_id: string
    timestamp: string | null
}

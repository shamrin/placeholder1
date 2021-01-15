interface Query {
    query: string
    params: any[]
}

function sql(parts: string[], ...params: any[]) {
    let query = parts.map((part, index) => {
        if (index < parts.length - 1) part += '$' + (index + 1)
        return part
    }).join('')
    return {query, params}
}

sql`select name from user where userid = ${42}`)
// => { "query": "select name from user where userid = $1", "params": [ 42 ] } 

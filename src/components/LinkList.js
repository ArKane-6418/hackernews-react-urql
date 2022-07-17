import { React, useCallback, useMemo } from 'react'
import { useQuery } from 'urql'
import gql from 'graphql-tag'
import Link from './Link'

/* To add data-fetching logic:
- write the query as a JS constant using the gql parser function
- use the useQuery hook passing the GraphQL query and variables as { query, variables }
- access the query results that the hook returns, const [result] = useQuery(...)
*/

/*
- skip defines the offset where the query will start
- first defines the limit of how many elements you want to load
- orderBy defines how the returned list will be sorted
*/
const FEED_QUERY = gql`
    query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
        feed(first: $first, skip: $skip, orderBy: $orderBy) {
            count
            links {
                id
                createdAt
                url
                description
                postedBy {
                    id 
                    name
                }
                votes {
                    id
                    user {
                        id
                    }
                }
            }
        }
    }
`

const LinkList = props => {
    const isNewPage = props.location.pathname.includes('new')
    const page = parseInt(props.match.params.page, 10)

    const nextPage = useCallback(() => {
        // Go to the next page if the current page isn't the last
        if (page <= data.feed.count / 10) {
            props.history.push(`/new/${page+1}`)
        }
    }, [props.history, data.feed.count, page])

    const previousPage = useCallback(() => {
        if (page > 1) {
            props.history.push(`/new/${page-1}`)
        }
    }, [props.history, page])

    const variables = useMemo(() => ({
        skip: isNewPage ? (page - 1) * 10 : 0,
        first: isNewPage ? 10 : 100,
        orderBy: isNewPage ? 'createdAt_DESC' : null,
    }), [isNewPage, page])

    const pageIndex = isNewPage ? (page - 1) * 10 : 0
    const [result] = useQuery({ query: FEED_QUERY, variables })
    const { data, fetching, error } = result


    const linksToRender = useMemo(() => {
        if (!data || !data.feed) {
            return [];
        } else if (isNewPage) {
            return data.feed.links
        } else {
            // For top, sort the links by votes
            const rankedLinks = data.feed.links.slice().sort((l1, l2) => l2.votes.length - l1.votes.length)
            return rankedLinks
        }
    })

    if (fetching) return <div>Fetching</div>
    if (error) return <div>Error</div>

    return (
        <React.Fragment>
            <div>
                {linksToRender.map((link, index) => <Link key={link.id} link={link} index={pageIndex + index}/>)}
            </div>
            {isNewPage && (
                <div className='flex ml4 mv3 gray'>
                    <div className='pointer mr2' onClick={previousPage}>
                        Previous
                    </div>
                    <div className='pointer' onClick={nextPage}>
                        Next
                    </div>
                </div>
            )}
        </React.Fragment>
    )
}

export default LinkList
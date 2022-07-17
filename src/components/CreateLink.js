import { React, useState, useCallback } from 'react'
import gql from 'graphql-tag';
import { useMutation } from 'urql';

const POST_MUTATION = gql`
    mutation PostMutation($description: String!, $url: String!) {
        post(description: $description, url: $url) {
            id
            createdAt
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
`


const CreateLink = props => {
    const [description, setDescription] = useState('')
    const [url, setURL] = useState('')

    /*
    1. Write the query as a JavaScript constant using the gql parser function
    2. Use the useMutation hook passing the GraphQL mutation as the first and only argument
    3. Call the executeMutation with the mutation’s variables and receive the result as a promise or in the first state part of the array that the useMutation hook returns
    */
   
    const [state, executeMutation] = useMutation(POST_MUTATION)
  
    // After the mutation is performed, use the history prop passed down by react-router to redirect to LinkList
    const submit = useCallback(() => {
        executeMutation({ url, description }).then(() => {
            props.history.push('/')
        })
    }, [executeMutation, url, description, props.history])

    return (
        <div>
            <div className='flex flex-column mt3'>
                <input
                    className='mb2'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    type='text'
                    placeholder='A description for the link'
                />
                <input 
                    className='mb2'
                    value={url}
                    onChange={e => setURL(e.target.value)}
                    type='text'
                    placeholder='The URL for the link'
                />
            </div>
            <button 
                disabled={state.fetching}
                onClick={submit}
            >
                Submit
            </button>
        </div>
    )
}

export default CreateLink
import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { getToken, deleteToken } from '../token'

const Header = props => {
    const isLoggedIn = !!getToken()
    return (
        <div className="flex pal justify-between nowrap orange">
            <div className="flex flex-fixed black">
                <div className="fw7 mr1">Hacker News</div>
                <Link to="/" className="ml1 no-underline black">
                    New
                </Link>
                <div className="ml1">|</div>
                <Link to="/top" className="ml1 no-underline black">
                Top
                </Link>
                <div className="ml1">|</div>
                <Link to="/search" className="ml1 no-underline black">
                    Search
                </Link>
                {isLoggedIn && (
                    <div className="flex">
                        <div className="ml1">!</div>
                        <Link to="/create" className="ml1 no-underline black">
                            Submit
                        </Link>
                    </div>
                )}
            </div>

            <div className="flex flex-fixed">
                {isLoggedIn ? (
                <div
                    className="ml1 pointer black"
                    onClick={() => {
                    deleteToken()
                    props.history.push('/')
                    }}
                >
                    Logout
                </div>
                ) : (
                <Link to="/login" className="ml1 no-underline black">
                    Login
                </Link>
                )}
            </div>
        </div>
    )
}

export default withRouter(Header)
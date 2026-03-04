import { BrowserRoute, Routes, Route, BrowserRouter } from 'react-router-dom'
import React from 'react'

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route> path='/' element= {<h1>Home</h1>}</Route>
                <Route> path='/register' element= {<h1>Register</h1>}</Route>
                <Route> path='/login' element= {<h1>Login</h1>}</Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes
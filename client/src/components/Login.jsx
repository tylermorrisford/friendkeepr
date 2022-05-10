import React, {useState, useContext} from 'react';
import { UserContext } from '../context/UserContextProvider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { Form, Icon, Button } from 'react-bulma-components';
import { LogoMask } from './extras/LogoMask';

const Login = () => {
    const {logUserIn} = useContext(UserContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [feedback, setFeedback] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleEmail = e => {
        setEmail(e.target.value)
    }

    const handlePassword = e => {
        setPassword(e.target.value)
    }

    const clearForm = () => {
        setPassword('')
        setEmail('')
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        console.log('Email: ', email, "\nPassword: ", password);
        fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers:{          
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
              }
        }).then(res => res.json())
        .then(data => {
            console.log('login response data', data)
        // if (response.status !== 200) {throw Error}
        if (data.match) {
            logUserIn(email, data.user)
            clearForm()
            setLoading(false)
        } else {
            setFeedback('Sorry, there was a problem logging you in...')
            clearForm()
            setLoading(false)
        }
        })
        .catch(err => console.log('ERROR:', err))
        // console.log('login data posted...');
        // let data = await response.json()
        // console.log('login response data', data)
        // if (response.status !== 200) {throw Error}
        // if (data.match) {
        //     logUserIn(email, data.user)
        //     clearForm()
        //     setLoading(false)
        // } else {
        //     setFeedback('Sorry, there was a problem logging you in...')
        //     clearForm()
        //     setLoading(false)
        // }
    }

    return(
        <div className="container has-text-centered box" style={{ maxWidth: '375px' }}>
            <h3 className="is-size-4">Sign in to</h3>
            <LogoMask />
            <br /><br />
            <form>
            <Form.Field>
            <Form.Label>Email</Form.Label>
            <Form.Control>
                <Form.Input placeholder="Email" 
                    name="email" 
                    value={email} 
                    autoComplete="username"
                    onChange={handleEmail} />
                <Icon align="left">
                    <FontAwesomeIcon icon={faEnvelope} />
                </Icon>
            </Form.Control>
            </Form.Field>
            <Form.Field>
            <Form.Label>Password</Form.Label>
            <Form.Control>
                <Form.Input placeholder="********" 
                    name="password" 
                    type="password"
                    autoComplete="current-password" 
                    value={password} 
                    onChange={handlePassword} />
                <Icon align="left">
                    <FontAwesomeIcon icon={faLock} />
                </Icon>
            </Form.Control>
            </Form.Field>
            { loading ?             
            <Button.Group>
             <Button className="button is-loading" fullwidth rounded color="primary">Login</Button>
            </Button.Group>
            :
            <Button.Group>
             <Button fullwidth rounded color="primary" onClick={(e) => handleSubmit(e)}>Login</Button>
            </Button.Group>}
            </form>
            {feedback && feedback}
        </div>
    //     <div className="container has-text-centered box" style={{ maxWidth: '300px' }}>
    //     <form
    //       onSubmit={e => {
    //         e.preventDefault();
    //         handleSubmit();
    //       }}>
    //       <div className="field">
    //         <label className="label" htmlFor="email">Email</label>
    //         <div className="control has-icons-left">
    //           <input className="input" name="email" type="email" placeholder="email" required onChange={() => handleEmail()} />
    //           <span className="icon is-small is-left">
    //             <i className="fa fa-envelope"></i>
    //           </span>
    //         </div>
    //       </div>

    //       <div className="field">
    //         <label className="label" htmlFor="password">Password</label>
    //         <div className="control has-icons-left">
    //           <input className="input" name="password" type="password" placeholder="password" required onChange={() => handlePassword()}/>
    //           <span className="icon is-small is-left">
    //             <i className="fa fa-lock"></i>
    //           </span>
    //         </div>
    //       </div>

    //       <div className="field">
    //         <div className="control buttons is-centered">
    //           <input className="button is-medium is-danger is-fullwidth" type="submit" value="Sign In" />
    //         </div>
    //       </div>
    //     </form>
    //   </div>
    )
}

export default Login
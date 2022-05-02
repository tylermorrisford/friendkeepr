import React, {useState, useEffect} from 'react'
import { toast } from 'bulma-toast'

export default function FriendForm(props) {

    const getFriends = props.getAllFriends
    const editing = props.editing
    const editFriend = props.editFriend
    const clearEditFriend = props.clearEditFriend

    //state
    const [friendName, setFriendName] = useState('')
    const [friendNote, setFriendNote] = useState('')
    const [friendKnown, setFriendKnown] = useState('')
    // editing state
    const [editId, setEditId] = useState(null)

    //fetch (post) the add friend endpoint
    const addFriend = async () => {
        if (friendName === '') {
            return toast({
                        message: 'Your friend needs a name!',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        single: true,
                        duration: 2000,
                        position: 'top-left'
                    })
        }
        if (isNaN(friendKnown) || friendKnown === '') {
            return toast({
                        message: 'You\'ve known this friend for NaN? \n Please enter a number.',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        single: true,
                        duration: 2000,
                        position: 'top-left'
                    })
        } 
        let response = await fetch("/api/add_new_friend", {
            method: 'POST',
            body: JSON.stringify({
                friend_name: friendName,
                friend_note: friendNote,
                known_years: friendKnown
            }),
            headers:{          
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
        })
        let data = await response.json()
        if (response.status !== 200) {throw Error}
        console.log(data)
        if (data.data === 1) {
            setFriendName('')
            setFriendNote('')
            setFriendKnown('')
            getFriends()
        }   
    }

    // TODO: add some initial validation
    const handleName = e => {setFriendName(e.target.value)}

    const handleNote = e => {
        if (e.target.value.length > 25) {
            toast({
                message: 'Keep your notes short and sweet - less than 25 characters please...',
                type: 'is-warning',
                dismissible: true,
                pauseOnHover: true,
                single: true,
                duration: 2000,
                position: 'bottom-right'
            })
        } else {
            setFriendNote(e.target.value)
        }
    }

    const handleKnown = e => {
        if (e.target.value.length > 3 || isNaN(e.target.value)){
            toast({
                message: 'This field only accepts numbers...',
                type: 'is-danger',
                dismissible: true,
                pauseOnHover: true,
                single: true,
                duration: 2000,
                position: 'bottom-right'
            })
        } else {
            setFriendKnown(e.target.value)
        }
    }

    // effect to listen for props change and update form values
    useEffect(() => {
        if (editing) {
            setFriendName(editFriend.name)
            setFriendNote(editFriend.note)
            setFriendKnown(editFriend.known)
            setEditId(editFriend.id)
        }
        console.log('the edit friend id', editFriend.id)
    }, [editing])
    
    // update friend fetch request (if successful, clearEditFriends(); getFriends())
    const updateFriend = async () => {
        if (friendName === '') {
            return toast({
                        message: 'Your friend needs a name!',
                        type: 'is-danger',
                        dismissible: true,
                        pauseOnHover: true,
                        single: true,
                        duration: 2000,
                        position: 'top-left'
                    })
        }
        let response = await fetch("/api/update_friend", {
            method: 'POST',
            body: JSON.stringify({
                id: editId,
                friend_name: friendName,
                friend_note: friendNote,
                known_years: friendKnown
            }),
            headers:{          
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
        })
        let data = await response.json()
        if (response.status !== 200) {throw Error}
        console.log(data)
        if (data.data === 1) {
            setFriendName('')
            setFriendNote('')
            setFriendKnown('')
            setEditId('')
            clearEditFriend()
            getFriends()
        }   
    }

    //return
    return(
        <div className="column is-fullwidth">
            {editing ? <h3>Edit Your Friend!</h3> : <h3>Add a New Friend!</h3>}
            <div className="field is-horizontal">
                <div className="field-body">
                    {/* <div className="field-label is-normal">
                        <label className="label">Name</label>
                    </div> */}
                    <div className="field">
                        <p className="control is-expanded">
                            <input className="input is-success" 
                            onChange={(event) => {handleName(event)}}
                            type="text" placeholder="Friend's name" value={friendName}/>
                            <span className="icon is-small is-left">
                            <i className="fas fa-user"></i>
                            </span>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control is-expanded">
                            <input className="input is-success" 
                            onChange={(e) => {handleNote(e)}} value={friendNote}
                            type="text" placeholder="a note about this friend..."/>
                        </p>
                    </div>
                    <div className="field">
                        <p className="control is-expanded">
                            <input className="input is-success" 
                            onChange={(e) => {handleKnown(e)}} value={friendKnown}
                            type="text" placeholder="been friends for __ years"/>
                        </p>
                    </div>


                <div className = "field is-grouped is-grouped-right">
                    <div className = "control">
                        {editing ?                         
                        <button className = "button is-info" type="submit"
                            onClick={() => {updateFriend()}}
                        >Update</button>               
                    :                    
                        <button className = "button is-link" type="submit"
                            onClick={() => {addFriend()}}
                        >Submit</button>
                    }
                    </div>
                </div>
                </div>
            </div>

        </div>

    )
}

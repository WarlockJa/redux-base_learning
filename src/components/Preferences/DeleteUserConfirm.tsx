import './deleteuserconfirm.css'

const DeleteUserConfirm = ({ callback }: { callback: (res: boolean) => void}) => {
    return (
        <section className="deleteUser">
            <h2>Are you sure you want to delete account?</h2>
            <div className='deleteUser--buttonsBlock'>
                <button onClick={() => callback(true)}>Yes</button>
                <button onClick={() => callback(false)}>No</button>
            </div>
        </section>
    )
}

export default DeleteUserConfirm
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowAltCircleDown, faArrowAltCircleUp, faCog } from "@fortawesome/fontawesome-free-solid"
import classNames from "classnames"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import SwitchDarkMode from "../../util/SwitchDarkMode"
import LanguageSwitcher from "../../util/LanguageSwitcher"

const GlobalSettings = () => {
    const [hidden, setHidden] = useState(true)
    return (
        <>
            <button
                className='headerMenu--button'
                onClick={() => setHidden(prev => !prev)}
            ><span>Sign In <FontAwesomeIcon
                                style={{ backgroundColor: 'transparent' }}
                                icon={hidden ? faArrowAltCircleDown as IconProp : faArrowAltCircleUp as IconProp}/></span>
            </button>
            <div className={classNames("headerMenu__dropMenu--wrapper noBackground", { dropMenuHidden: hidden, sendToBackground: hidden })}>
                <form className="headerMenuGlobal__form">
                    {/* <LanguageSwitcher
                        fullDescription={false}
                        value={id}
                    /> */}

                    <SwitchDarkMode />
                </form>
                {/* <form className="headerMenu__form">
                    {(login.isLoading || gLogin.isLoading) && <div className="headerMenu__form--cover"><Spinner embed={false}/></div>}
                    {(login.isError || gLogin.isError) && signInCoverVisible && <div onClick={() => handleErrorClick()} className="headerMenu__form--cover">{
                        login.isError
                            ? isApiAuthError(login.error) ? login.error.data.message : JSON.stringify(login.error)
                            : isApiAuthError(gLogin.error) ? gLogin.error.data.message : JSON.stringify(gLogin.error)}
                        </div>}
                    <label htmlFor="headerMenu__form--email">email</label>
                    <input
                        ref={formEmailRef}
                        id="headerMenu__form--email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={50}
                        required
                    />
                    <label htmlFor="headerMenu__form--password">password</label>
                    <input
                        ref={formPassRef}
                        id="headerMenu__form--password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={50}
                        required
                    />
                    <button disabled={login.isLoading || gLogin.isLoading}>Sign in</button>
                    <LineBreak />
                    <button onClick={() => loginGoogle()} type='button'><span style={{ backgroundColor: "transparent" }}><FontAwesomeIcon style={{ backgroundColor: "transparent" }} icon={faGoogle}/> sign in</span></button>
                    <LineBreak />
                    <Link className='headerMenu__form--registerLink' to='/register'><button onClick={() => setHidden(true)} className='headerMenu__form--registerButton' type='button'>Register</button></Link>
                </form> */}
            </div>
            {/* {!hidden && <div className="headerMenu--overlay" onClick={() => handleOverlayClick()}></div>} */}
        </>
    )
}

export default GlobalSettings
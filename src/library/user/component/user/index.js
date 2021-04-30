import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import cn from 'classnames';

import UserController from '../../../../api/user-controller';

import { guestSession, setUserSession as setApiConfigurationUserSession } from '../../../../api/api-configuration';
import { cache, interval } from './configuration';

import { userTypeEnum } from '../../user-enum';

import style from './style.module.scss';

/**User@param {Props}*/
export default function User({
    userTypeId,
    page,
    onAuthenticated
}) {
    /**@type {[UserSessionContract, React.Dispatch<React.SetStateAction<UserSessionContract>]} */
    const userSessionTokenCacheKey = cache.userSessionTokenKey(userTypeId);
    const [userSession, setUserSession] = useState(undefined);
    const [isHover, setIsHover] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies([userSessionTokenCacheKey]);
    const isSigningOut = useRef(false);

    //Authenticate
    useEffect(() => {
        if (isSigningOut.current) return;

        var isDisposed;

        const load = async () => {
            /**@type {string} */
            var cachedUserSessionToken = cookies[userSessionTokenCacheKey];

            if (!cachedUserSessionToken) {
                removeCookie(userSessionTokenCacheKey, cache.userSessionCookieOptions());
                setApiConfigurationUserSession(guestSession);
                setUserSession(guestSession);
                onAuthenticated && onAuthenticated(guestSession.user);
                return;
            }

            var { data: authenticatedUserSession, isSuccess } = await UserController.authenticate.get({ userTypeId, token: cachedUserSessionToken }); if (isDisposed) return;

            if (!isSuccess) {
                removeCookie(userSessionTokenCacheKey, cache.userSessionCookieOptions());
                setApiConfigurationUserSession(guestSession);
                setUserSession(guestSession);
                onAuthenticated && onAuthenticated(guestSession.user);
                return;
            }

            authenticatedUserSession.user.isGuest = false;

            setCookie(userSessionTokenCacheKey, authenticatedUserSession.token, cache.userSessionCookieOptions(authenticatedUserSession.tokenExpiresOn));
            setApiConfigurationUserSession(authenticatedUserSession);
            setUserSession(authenticatedUserSession);
            onAuthenticated && onAuthenticated(authenticatedUserSession.user);
        };

        const dispose = () => {
            isDisposed = true;
            if (isSigningOut.current) return;
            setApiConfigurationUserSession(guestSession);
            setUserSession(guestSession);
            onAuthenticated && onAuthenticated(guestSession.user);
        };

        load();
        return dispose;
    }, [userTypeId, onAuthenticated, userSessionTokenCacheKey, cookies, setCookie, removeCookie]);

    //Authenticate Interval
    useEffect(() => {
        if (!userSession || userSession.user.isGuest || isSigningOut.current) return;

        var isDisposed, intervalId;

        const load = async () => {
            intervalId = setInterval(async () => {
                var { data: authenticatedUserSession, isSuccess } = await UserController.authenticate.get({ userTypeId: userSession.user.type.typeId, token: userSession.token }); if (isDisposed) return;

                if (!isSuccess) {
                    window.location.reload();
                    return;
                }

                authenticatedUserSession.user.isGuest = false;

                setCookie(userSessionTokenCacheKey, authenticatedUserSession.token, cache.userSessionCookieOptions(authenticatedUserSession.tokenExpiresOn));
                setApiConfigurationUserSession(authenticatedUserSession);
                setUserSession(authenticatedUserSession);
            }, interval.authenticateInMilliseconds);
        };

        const dispose = () => {
            isDisposed = true;
            clearInterval(intervalId);
        };

        load();
        return dispose;
    }, [userSession, userTypeId, onAuthenticated,userSessionTokenCacheKey, setCookie]);

    return (
        <Container className='container-fluid ps-0 pe-0'>
            <Row>
                <Col>
                    <div
                        onClick={async () => {
                            if (!userSession) return;

                            if (userSession.user.isGuest) {
                                const subdomain = window.location.host.split('.')[0];

                                var { data: consentUrl, isSuccess } = await UserController.consentUrl.get({ userTypeId, subdomain, page });

                                isSuccess && (window.location = consentUrl);
                                return;
                            }

                            isSigningOut.current = true;
                            removeCookie(userSessionTokenCacheKey, cache.userSessionCookieOptions());
                            await UserController.revoke.post();
                            window.location.reload();
                        }}
                        onMouseOver={() => setIsHover(true)}
                        onMouseOut={() => setIsHover(false)}
                        className={cn(style.container, { [style.isAuthenticated]: !userSession?.user.isGuest, [style.isDeauthenticated]: userSession?.user.isGuest }, 'm-auto ps-3 pe-3 pt-2 pb-2')}
                    >
                        <p className={cn(style.name, 'fw-bold text-center')}>{
                            isHover
                                ? !userSession?.user.isGuest
                                    ? 'Sign Out'
                                    : 'Sign In'
                                : userSession
                                    ? userSession.user.isGuest
                                        ? 'Guest'
                                        : userSession.user.type.typeId === userTypeEnum.google
                                            ? userSession.user.google.name
                                            : userSession.user.stocktwits.username
                                    : 'Signing In...'
                        }</p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

/**Props
 * @typedef Props
 * @property {number} userTypeId
 * @property {string} page
 * @property {(user: UserContract) => void } onAuthenticated
*/
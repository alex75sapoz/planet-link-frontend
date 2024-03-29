import { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import cn from 'classnames';

import AccountController from '../../../../api/account-controller';

import { guestSession, setUserSession as setApiConfigurationUserSession } from '../../../../api/api-configuration';
import { cache, interval } from './configuration';

import { userTypeEnum } from '../../account-enum';

import style from './style.module.scss';

/**@param {Props}*/
export default function User({
    userTypeId,
    page,
    onAuthenticated
}) {
    const userSessionTokenCacheKey = cache.userSessionTokenKey(userTypeId);
    /**@type {[UserSessionContract, React.Dispatch<React.SetStateAction<UserSessionContract>]} */
    const [userSession, setUserSession] = useState(undefined);
    const [isHover, setIsHover] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies([userSessionTokenCacheKey]);
    const [isSigningIn, setIsSigningIn] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);

    //Authenticate
    useEffect(() => {
        var isDisposed;

        const load = async () => {
            /**@type {string} */
            var cachedUserSessionToken = cookies[userSessionTokenCacheKey];

            if (!cachedUserSessionToken) {
                removeCookie(userSessionTokenCacheKey, cache.userSessionCookieOptions());
                setApiConfigurationUserSession(guestSession);
                setUserSession(guestSession);
                setIsSigningIn(false);
                onAuthenticated && onAuthenticated(guestSession.user);
                return;
            }

            setIsSigningIn(true);

            var { data: authenticatedUserSession, isSuccess } = await AccountController.user.authenticate.get({ userTypeId, token: cachedUserSessionToken }); if (isDisposed) return;

            if (!isSuccess) {
                removeCookie(userSessionTokenCacheKey, cache.userSessionCookieOptions());
                setApiConfigurationUserSession(guestSession);
                setUserSession(guestSession);
                setIsSigningIn(false);
                onAuthenticated && onAuthenticated(guestSession.user);
                return;
            }

            authenticatedUserSession.user.isGuest = false;

            setApiConfigurationUserSession(authenticatedUserSession);
            setUserSession(authenticatedUserSession);
            setCookie(userSessionTokenCacheKey, authenticatedUserSession.token, cache.userSessionCookieOptions(authenticatedUserSession.tokenExpiresOn));
            setIsSigningIn(false);
            onAuthenticated && onAuthenticated(authenticatedUserSession.user);
        };

        const dispose = () => {
            isDisposed = true;
            setApiConfigurationUserSession(guestSession);
            setUserSession(guestSession);
            setIsSigningIn(true);
            setIsSigningOut(false);
            onAuthenticated && onAuthenticated(guestSession.user);
        };

        load();
        return dispose;

        //Ignore cookies dependency
        // eslint-disable-next-line
    }, [userTypeId, onAuthenticated, userSessionTokenCacheKey, setCookie, removeCookie]);

    //Authenticate Interval
    useEffect(() => {
        if (!userSession || userSession.user.isGuest) return;

        var isDisposed, intervalId;

        const load = async () => {
            intervalId = setInterval(async () => {
                var { data: authenticatedUserSession, isSuccess } = await AccountController.user.authenticate.get({ userTypeId: userSession.user.userType.userTypeId, token: userSession.token }); if (isDisposed) return;

                if (!isSuccess) {
                    window.location.reload();
                    return;
                }

                authenticatedUserSession.user.isGuest = false;

                setApiConfigurationUserSession(authenticatedUserSession);
                setUserSession(authenticatedUserSession);
                setCookie(userSessionTokenCacheKey, authenticatedUserSession.token, cache.userSessionCookieOptions(authenticatedUserSession.tokenExpiresOn));
            }, interval.authenticateInMilliseconds);
        };

        const dispose = () => {
            isDisposed = true;
            clearInterval(intervalId);
        };

        load();
        return dispose;
    }, [userSession, userTypeId, onAuthenticated, userSessionTokenCacheKey, setCookie]);

    const getLabel = () => {
        if (isSigningIn)
            return 'Signing In...';

        if (isSigningOut)
            return 'Signing Out...';

        if (!userSession || userSession.user.isGuest)
            return isHover
                ? 'Sign In'
                : 'Guest';

        if (isHover)
            return 'Sign Out';

        switch (userSession.user.userType.userTypeId) {
            case userTypeEnum.google: return userSession.user.google.name;
            case userTypeEnum.stocktwits: return userSession.user.stocktwits.username;
            case userTypeEnum.fitbit: return userSession.user.fitbit.shortName;
            default: return 'Unknown';
        }
    };

    return (
        <Container className='container-fluid ps-0 pe-0'>
            <Row>
                <Col>
                    <div
                        onClick={async () => {
                            if (!userSession) return;

                            if (userSession.user.isGuest) {
                                const subdomain = window.location.host.split('.')[0];

                                var { data: consentUrl, isSuccess } = await AccountController.user.consentUrl.get({ userTypeId, subdomain, page });

                                isSuccess && (window.location = consentUrl);
                                return;
                            }

                            setIsSigningOut(true);
                            removeCookie(userSessionTokenCacheKey, cache.userSessionCookieOptions());
                            await AccountController.user.revoke.post();
                            window.location.reload();
                        }}
                        onMouseOver={() => setIsHover(true)}
                        onMouseOut={() => setIsHover(false)}
                        className={cn(style.container, { [style.isAuthenticated]: !userSession?.user.isGuest, [style.isDeauthenticated]: userSession?.user.isGuest }, 'm-auto ps-3 pe-3 pt-2 pb-2')}
                    >
                        <p className={cn(style.name, 'fw-bold text-center')}>
                            {getLabel()}
                        </p>
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
 * @property {(user: AccountUserContract) => void } onAuthenticated
*/
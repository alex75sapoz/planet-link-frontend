import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import UserController from '../../../api/user-controller';

import { cache } from '../../../library/user/component/user/configuration';

import { userTypeEnum } from '../../../library/user/user-enum';

import Loader from '../../../library/base/base-loader';

export default function AuthenticationMain() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [,setCookie] = useCookies();

    useEffect(() => {
        var isDisposed;

        const load = async () => {
            const userTypeId = Number.parseInt(searchParams.get('userTypeId'));
            const code = searchParams.get('code');
            const subdomain = searchParams.get('subdomain');
            const page = searchParams.get('page');
            const protocol = window.location.protocol;
            const domain = window.location.host.replace(`${window.location.host.split('.')[0]}.`, '');
            const url = `${protocol}//${subdomain}.${domain}/${page}`

            if (userTypeId === userTypeEnum.guest || !code) {
                window.location = url;
                return;
            }

            var { data: authenticatedUserSession, isSuccess } = await UserController.authenticate.get({ userTypeId, code, subdomain, page }); if (isDisposed) return;

            if (!isSuccess) {
                window.location = url;
                return;
            }

            setCookie(cache.userSessionTokenKey(userTypeId), authenticatedUserSession.token, cache.userSessionCookieOptions(authenticatedUserSession.tokenExpiresOn));

            window.location = url;
        };

        const dispose = () => {
            isDisposed = true;
        };

        load();
        return dispose;
    }, [navigate, searchParams, setCookie]);

    return (
        <Loader />
    )
}
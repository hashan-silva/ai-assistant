import {CognitoIdentityProviderClient} from '@aws-sdk/client-cognito-identity-provider';

const region = process.env.NEXT_PUBLIC_COGNITO_REGION;
const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;

export const getCognitoConfig = () => {
  if (!region || !clientId) {
    throw new Error('Cognito is not configured');
  }

  return {
    client: new CognitoIdentityProviderClient({region}),
    clientId
  };
};

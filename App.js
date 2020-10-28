import React, { useState, useEffect, useCallback, useMemo } from "react";
import { UIManager, View, Alert, ScrollView, AsyncStorage } from "react-native";
import {
  authorize,
  refresh,
  revoke,
  prefetchConfiguration,
  register,
} from "react-native-app-auth";
import {
  Page,
  Button,
  ButtonContainer,
  Form,
  FormLabel,
  FormValue,
  Heading,
} from "./components";
import jwt_decode from "jwt-decode";
import axios from "axios";

const configs = {
  identityserver: {
    issuer: "https://demo.identityserver.io",
    clientId: "interactive.public",
    redirectUrl: "io.identityserver.demo:/oauthredirect",
    additionalParameters: {},
    scopes: ["openid", "profile", "email", "offline_access"],

    // serviceConfiguration: {
    //   authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
    //   tokenEndpoint: 'https://demo.identityserver.io/connect/token',
    //   revocationEndpoint: 'https://demo.identityserver.io/connect/revoke'
    // }
  },
  auth0: {
    // From https://openidconnect.net/
    issuer: "https://samples.auth0.com",
    clientId: "kbyuFDidLLm280LIwVFiazOqjO3ty8KH",
    clientSecret: "wbac4wAeLlyU1W2N0EzB5jJkYaoa",
    redirectUrl: "https://openidconnect.net/callback",
    additionalParameters: {},
    scopes: ["openid", "profile", "email", "phone", "address"],

    // serviceConfiguration: {
    //   authorizationEndpoint: 'https://samples.auth0.com/authorize',
    //   tokenEndpoint: 'https://samples.auth0.com/oauth/token',
    //   revocationEndpoint: 'https://samples.auth0.com/oauth/revoke'
    // }
  },
  gg: {
    issuer: "https://accounts.google.com",
    clientId:
      "511828570984-7nmej36h9j2tebiqmpqh835naet4vci4.apps.googleusercontent.com",
    redirectUrl:
      "com.googleusercontent.apps.511828570984-7nmej36h9j2tebiqmpqh835naet4vci4:/oauth2redirect/google",
    scopes: ["openid", "profile", "email"],
  },
  htid: {
    issuer: "https://htid.hungthinhcorp.com.vn",
    clientId: "jEUbwJtQrlWHVvphP2XsG9Zgjq8a",
    redirectUrl: "org.reactjs.native.example.Example:/redirect",
    additionalParameters: {},
    scopes: ["openid", "profile", "phone", "email", "offline_access"],
    serviceConfiguration: {
      authorizationEndpoint:
        "https://htid.hungthinhcorp.com.vn/oauth2/authorize",
      tokenEndpoint: "https://htid.hungthinhcorp.com.vn/oauth2/token",
      revocationEndpoint: "https://htid.hungthinhcorp.com.vn/oauth2/revoke",
      // registrationEndpoint:
      //   "https://htid.hungthinhcorp.com.vn/authenticationendpoint/login.do",
    },
  },
};

const defaultAuthState = {
  hasLoggedInOnce: false,
  provider: "",
  accessToken: "",
  accessTokenExpirationDate: "",
  refreshToken: "",
};

const App = () => {
  const [authState, setAuthState] = useState(defaultAuthState);
  const [profile, setProfile] = useState("");
  React.useEffect(() => {
    prefetchConfiguration({
      warmAndPrefetchChrome: true,
      ...configs.identityserver,
    });
  }, []);

  const handleAuthorize = useCallback(
    async (provider) => {
      try {
        const config = configs[provider];
        const newAuthState = await authorize(config);
        console.log("authorize", newAuthState, provider);
        setAuthState({
          hasLoggedInOnce: true,
          provider: provider,
          ...newAuthState,
        });
      } catch (error) {
        // Alert.alert('Failed to log in', error.message);
        console.log("Failed to log in", error.message);
      }
    },
    [authState]
  );

  const handleRefresh = useCallback(async () => {
    try {
      const config = configs[authState.provider];
      const newAuthState = await refresh(config, {
        refreshToken: authState.refreshToken,
      });

      setAuthState((current) => ({
        ...current,
        ...newAuthState,
        refreshToken: newAuthState.refreshToken || current.refreshToken,
      }));
    } catch (error) {
      Alert.alert("Failed to refresh token", error.message);
    }
  }, [authState]);

  const handleRevoke = useCallback(async () => {
    try {
      const config = configs[authState.provider];
      await revoke(config, {
        tokenToRevoke: authState.accessToken,
        sendClientId: true,
      });

      setAuthState({
        provider: "",
        accessToken: "",
        accessTokenExpirationDate: "",
        refreshToken: "",
      });
    } catch (error) {
      Alert.alert("Failed to revoke token", error.message);
    }
  }, [authState]);

  const handleLogout = useCallback(async () => {
    try {
      const newAuth = await fetch(`https://vominhvo.tech/oidc/logout`);
      // console.log(newAuth.status)
      if (newAuth.status == 200) {
        setAuthState({
          provider: "",
          accessToken: "",
          accessTokenExpirationDate: "",
          refreshToken: "",
        });
      }
    } catch (error) {
      Alert.alert("Failed to logout", error.message);
    }
  }, [authState]);

  const handleFetchProfile = useCallback(() => {
    try {
      axios
        .get(`https://profile-demo-ht.herokuapp.com/api/profile/thang`, {
          headers: {
            Authorization: `Bearer ${authState.accessToken}`,
          },
        })
        .then((response) => {
          // if (response.status === 401) {
          //   // console.log("vao day");
          // }
          console.log(response);
          setProfile(response.data);
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Failed to fetch Profile", error.message);
        });
    } catch (error) {
      Alert.alert("Failed to fetch Profile", error.message);
    }
  }, [authState]);

  // console.log(AsyncStorage.getAllKeys());

  const showRevoke = useMemo(() => {
    if (authState.accessToken) {
      const config = configs[authState.provider];
      if (config.issuer || config.serviceConfiguration.revocationEndpoint) {
        return true;
      }
    }
    return false;
  }, [authState]);
  const decoded = !!authState.accessToken ? jwt_decode(authState.idToken) : "";
  console.log(decoded);
  const name = decoded.name ?? "";
  const email = decoded.email ?? "";
  const telephone = decoded.phone_number ?? "";

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <Page>
        {!!authState.accessToken ? (
          <Form>
            <FormLabel>Name</FormLabel>
            <FormValue>{name}</FormValue>
            <FormLabel>Email</FormLabel>
            <FormValue>{email}</FormValue>
            <FormLabel>Telephone</FormLabel>
            <FormValue>{telephone}</FormValue>
            <FormLabel>accessToken</FormLabel>
            <FormValue>{authState.accessToken}</FormValue>
            <FormLabel>accessTokenExpirationDate</FormLabel>
            <FormValue>{authState.accessTokenExpirationDate}</FormValue>
            <FormLabel>refreshToken</FormLabel>
            <FormValue>{authState.refreshToken}</FormValue>
            <FormLabel>scopes</FormLabel>
            <FormValue>{authState.scopes.join(", ")}</FormValue>
            <FormLabel>Profile</FormLabel>
            {Object.keys(profile).map((item, index) => {
              return (
                <FormValue key={index}>
                  {item} : {profile[item]}
                </FormValue>
              );
            })}
          </Form>
        ) : (
          <Heading>
            {authState.hasLoggedInOnce ? "Goodbye." : "Hello, stranger."}
          </Heading>
        )}

        <ButtonContainer>
          {!authState.accessToken ? (
            <View
              style={{
                width: "100%",
              }}
            >
              <Button
                onPress={() => handleAuthorize("htid")}
                text="HTID"
                color="#f7941c"
                style={{ width: "100%" }}
              />
              <Button
                onPress={() => handleAuthorize("identityserver")}
                text="IdentityServer"
                color="#2980B9"
                style={{ width: "100%" }}
              />
              <Button
                onPress={() => handleAuthorize("auth0")}
                text="Auth0"
                color="#eb5524"
                style={{ width: "100%" }}
              />

              <Button
                onPress={() => handleAuthorize("gg")}
                text="Google"
                color="#4285f3"
                style={{ width: "100%" }}
              />
            </View>
          ) : null}
          <View style={{ flex: 1, flexDirection: "row" }}>
            {!!authState ? (
              <Button
                onPress={handleFetchProfile}
                style={{ flex: 1 }}
                text="Profile"
                color="#24C2CB"
              />
            ) : null}
            {!!authState.refreshToken ? (
              <Button
                onPress={handleRefresh}
                style={{ flex: 1 }}
                text="Refresh"
                color="#24C2CB"
              />
            ) : null}
            {showRevoke ? (
              <Button
                onPress={handleRevoke}
                style={{ flex: 1 }}
                text="Revoke"
                color="#EF525B"
              />
            ) : null}
            {showRevoke ? (
              <Button
                onPress={handleLogout}
                style={{ flex: 1 }}
                text="Logout"
                color="#EF525B"
              />
            ) : null}
          </View>
        </ButtonContainer>
      </Page>
    </ScrollView>
  );
};

export default App;

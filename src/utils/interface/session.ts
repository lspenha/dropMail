export interface DataSession {
  introduceSession: IntroduceSession;
}

export interface IntroduceSession {
  id: string;
  expiresAt: string;
  addresses: addresses[];
}

export interface addresses {
  address: string;
  __typename: string;
}

export interface Session {
  id: string;
  expiresAt: string;
  address: string;
}

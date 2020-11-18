declare namespace Express {
  export interface Request {
    hostUrl: string;
    currentUrl: string;
    user: {
      id: string;
    };
  }
}

type doubleReturn<T> = T extends undefined
  ?
      | { status: true }
      | {
          status: false;
          message: string;
          actions?: ("resetKeyExchange" | "signOut")[];
        }
  :
      | { status: true; value: T }
      | {
          status: false;
          message: string;
          actions?: ("resetKeyExchange" | "signOut")[];
        };

export { doubleReturn };

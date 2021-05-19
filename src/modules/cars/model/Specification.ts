import { v4 as uuidV4 } from "uuid";

class Specification {
  id?: string;
  name: string;
  description: string;
  created_at: Date;

  // this is method when class is called;
  constructor() {
    if (!this.id) {
      this.id = uuidV4();
    }
  }
}

export { Specification };

using db as my from '../db/schema';


service MyService {

    entity Test as projection on my.Test;

}

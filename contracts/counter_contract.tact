import "@stdlib/deploy";

contract CounterContract with Deployable {

    id: Int as uint32;
    // variable to hold the value of the counter
    val: Int as uint32;

    // set the initial value of val as 0 during deployment
    init(id: Int) {
        self.id = id;
        self.val = 0;    
    }

    // increases the value of val by 1
    receive("increment"){
        self.val = self.val + 1;
    }

    // read the current value of the val
    get fun counter(): Int {
        return self.val;
    }

    get fun id(): Int {
        return self.id;
    }
}
module daonation_addr::DAOnationTest3  {

  use std::string::String;
    use aptos_std::smart_table::{Self, SmartTable};

  use std::string;

  // Errors
  const E_NOT_INITIALIZED: u64 = 1;



  struct DaoList has key {
    daos: SmartTable<u64, DaoUriStruct> ,
    dao_ids: u64
  }
  struct DaoUriStruct has store, drop, copy {
  
    dao_id: u64,
    dao_wallet: String,
    dao_uri: String,
    template:String,
    finished: String,
    
  }


  public entry fun init(account: &signer){
    let dao_list = DaoList {
      daos: smart_table::new(),
      dao_ids: 0
    };
    // move the DaoList resource under the signer account
    move_to(account, dao_list);

  }

  public entry fun create_dao(_account: &signer, signer_address: address, _dao_wallet: String, _dao_uri: String, _template: String) acquires DaoList {

    // assert signer has created a list
    assert!(exists<DaoList>(signer_address), E_NOT_INITIALIZED);
    // gets the DaoList resource
    let dao_list = borrow_global_mut<DaoList>(signer_address);
    // increment DAO counter
    let counter = dao_list.dao_ids + 1;
    // creates a new DAO
    let new_uri = DaoUriStruct {
       dao_id: counter,
        dao_wallet: _dao_wallet,
        dao_uri: _dao_uri,
        template : _template,
        finished: string::utf8(b"False"),
    };

    // adds the new DAO into the DAOs table
    smart_table::add(&mut dao_list.daos, counter, new_uri);
    // sets the dao counter to be the incremented counter
    dao_list.dao_ids = counter;
  }

   #[view]
    /// Return all the reward tokens supported by the rewards pool.
    public fun get_dao(signer_address: address, counter:u64): DaoUriStruct acquires  DaoList{
       let dao_list = borrow_global_mut<DaoList>(signer_address);

      *smart_table::borrow(&mut dao_list.daos, counter)
    }


}

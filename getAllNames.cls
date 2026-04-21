public with sharing class getAllNames {
    @AuraEnabled(cacheable = true)
       public static List<String> getAlllName(){
		Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
        List<String> allObjectName = new List<String>(gd.keySet());
        for(Schema.SObjectType s : gd.values()){
            Schema.DescribeSObjectResult d = s.getDescribe();
        }
        allObjectName.sort();
        return allObjectName;
    }
    @AuraEnabled(cacheable = true)
    public static List<String> helper(String allObjectName){
        Map<String,Schema.SObjectType> gd = Schema.getGlobalDescribe();
        if(!gd.containsKey(allObjectName)){
            return new List<String>();
        }
        Schema.DescribeSObjectResult objDes = gd.get(allObjectName).getDescribe();

        Map<String,Schema.SObjectField> feildMap = objDes.fields.getMap();

        List<String> fieldName =new List<String>(feildMap.keySet());
        fieldName.sort();

        return fieldName;
    }
}


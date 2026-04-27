public with sharing class getallObject {

    @AuraEnabled(cacheable=true)
    public static List<String> getObjects() {
        List<String> objs = new List<String>(Schema.getGlobalDescribe().keySet());
        objs.sort();
        return objs;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getFields(String objectName) {

        Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();

        if(!gd.containsKey(objectName)){
            return new List<String>();
        }

        Map<String, Schema.SObjectField> fieldsMap =
            gd.get(objectName).getDescribe().fields.getMap();

        List<String> fields = new List<String>(fieldsMap.keySet());
        fields.sort();

        return fields;
    }

    public class Wrapper{
        @AuraEnabled public List<SObject> data;
        @AuraEnabled public List<ColumnWrap> columns;
    }

    public class ColumnWrap{
        @AuraEnabled public String label;
        @AuraEnabled public String fieldName;
        @AuraEnabled public String type;
    }

    @AuraEnabled
    public static Wrapper getRecords(String objectName,String fieldName,String operator,String value){

        String condition='';

        if(operator=='equals'){
            condition = fieldName + ' = \'' + String.escapeSingleQuotes(value) + '\'';
        }
        else if(operator=='greater'){
            condition = fieldName + ' > ' + value;
        }
        else if(operator=='less'){
            condition = fieldName + ' < ' + value;
        }
        else if(operator=='contains'){
            condition = fieldName + ' LIKE \'%' + String.escapeSingleQuotes(value) + '%\'';
        }

        String query = 'SELECT Id, Name,'+fieldName+
                       ' FROM '+objectName+
                       ' WHERE '+condition+
                       ' LIMIT 200';

        List<SObject> recs = Database.query(query);

        Wrapper w = new Wrapper();
        w.data = recs;
        w.columns = new List<ColumnWrap>();

        ColumnWrap c1 = new ColumnWrap();
        c1.label='Id';
        c1.fieldName='Id';
        c1.type='text';

        ColumnWrap c2 = new ColumnWrap();
        c2.label='Name';
        c2.fieldName='Name';
        c2.type='text';

        ColumnWrap c3 = new ColumnWrap();
        c3.label=fieldName;
        c3.fieldName=fieldName;
        c3.type='text';

        w.columns.add(c1);
        w.columns.add(c2);
        w.columns.add(c3);

        return w;
    }
}

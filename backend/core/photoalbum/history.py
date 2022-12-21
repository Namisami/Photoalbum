from django.utils.html import format_html

class HistoryChanges():
    history_list_display = ["changed_fields", "list_changes"]

    def changed_fields(self, obj):
            if obj.prev_record:
                delta = obj.diff_against(obj.prev_record)
                return delta.changed_fields
            return None

    def list_changes(self, obj):
        fields = ""
        if obj.prev_record:
            delta = obj.diff_against(obj.prev_record)
            for change in delta.changes:
                if change.old == '':
                    change.old = 'None'
                if change.new == '':
                    change.new = 'None'
                fields += """
                    <strong>[{}]</strong><br/>
                    {} ---> {} <br/>
                    <br/>
                """

                change_old = change.old
                if type(change.old) is list:
                    change_old = '' if (len(change.old) > 0) else 'xxx'
                    for old in change.old:
                        key = list(old)[1]
                        change_old += (str(old[key]) + ', ')
                    change_old = change_old[:-2]

                change_new = change.new
                if type(change.new) is list:
                    change_new = '' if (len(change.new) > 0) else 'xxx'
                    for new in change.new:
                        key = list(new)[1]
                        change_new += (str(new[key]) + ', ')
                    change_new = change_new[:-2]
                
                fields = fields.format(change.field, change_old, change_new)
                fields = fields.replace("{", "{{")
                fields = fields.replace("}", "}}")
            return format_html(fields)
        return None
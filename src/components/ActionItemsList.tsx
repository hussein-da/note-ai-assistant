
import { useState } from "react";
import { ActionItem } from "@/types/meeting";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, User } from "lucide-react";
import { updateActionItem } from "@/services/meetingService";
import { useToast } from "@/hooks/use-toast";

interface ActionItemsListProps {
  actionItems: ActionItem[];
  meetingId: string;
  onActionItemUpdate?: (updatedItem: ActionItem) => void;
}

const ActionItemsList: React.FC<ActionItemsListProps> = ({ 
  actionItems, 
  meetingId,
  onActionItemUpdate 
}) => {
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  // Format the date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleToggleComplete = async (actionItem: ActionItem) => {
    setUpdating(actionItem.id);
    try {
      const updatedItem = await updateActionItem(
        meetingId, 
        actionItem.id, 
        !actionItem.completed
      );
      
      if (updatedItem && onActionItemUpdate) {
        onActionItemUpdate(updatedItem);
        toast({
          title: updatedItem.completed ? "Task marked as completed" : "Task marked as incomplete",
          description: updatedItem.text
        });
      }
    } catch (error) {
      toast({
        title: "Error updating task",
        description: "There was a problem updating the task status.",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Action Items</h3>
      {actionItems.length === 0 ? (
        <p className="text-muted-foreground">No action items found.</p>
      ) : (
        <ul className="space-y-3">
          {actionItems.map((item) => (
            <li 
              key={item.id} 
              className={`p-4 rounded-lg border ${
                item.completed 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Checkbox 
                    checked={item.completed}
                    disabled={updating === item.id}
                    onCheckedChange={() => handleToggleComplete(item)}
                    className={`${
                      updating === item.id ? 'opacity-50' : ''
                    } ${
                      item.completed ? 'text-green-500' : ''
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    item.completed ? 'text-gray-500 line-through' : 'text-gray-800'
                  }`}>
                    {item.text}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                    {item.assignee && (
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-3.5 w-3.5 mr-1" />
                        <span>{item.assignee}</span>
                      </div>
                    )}
                    {item.dueDate && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>{formatDate(item.dueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActionItemsList;

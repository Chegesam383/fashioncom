import { useState } from 'react';
import { Plus, Trash, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export interface AttributeValue {
  id: string;
  value: string;
}

export interface ProductAttribute {
  id: string;
  name: string;
  values: AttributeValue[];
}

interface AttributeEditorProps {
  attributes: ProductAttribute[];
  onChange: (attributes: ProductAttribute[]) => void;
}

export function AttributeEditor({ attributes, onChange }: AttributeEditorProps) {
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [editingAttributeId, setEditingAttributeId] = useState<string | null>(null);

  const addAttribute = () => {
    if (!newAttributeName.trim()) return;
    
    // Check for duplicate attribute names
    if (attributes.some(attr => attr.name.toLowerCase() === newAttributeName.toLowerCase())) {
      // Could show an error toast here
      return;
    }
    
    const newAttribute: ProductAttribute = {
      id: `attr-${Date.now()}`,
      name: newAttributeName.trim(),
      values: [],
    };
    
    onChange([...attributes, newAttribute]);
    setNewAttributeName('');
    setEditingAttributeId(newAttribute.id);
  };
  
  const removeAttribute = (id: string) => {
    onChange(attributes.filter(attr => attr.id !== id));
    if (editingAttributeId === id) {
      setEditingAttributeId(null);
    }
  };
  
  const addAttributeValue = (attributeId: string) => {
    if (!newAttributeValue.trim()) return;
    
    onChange(attributes.map(attr => {
      if (attr.id !== attributeId) return attr;
      
      // Check for duplicate values
      if (attr.values.some(v => v.value.toLowerCase() === newAttributeValue.toLowerCase())) {
        // Could show an error toast here
        return attr;
      }
      
      return {
        ...attr,
        values: [
          ...attr.values,
          {
            id: `val-${Date.now()}`,
            value: newAttributeValue.trim(),
          }
        ]
      };
    }));
    
    setNewAttributeValue('');
  };
  
  const removeAttributeValue = (attributeId: string, valueId: string) => {
    onChange(attributes.map(attr => {
      if (attr.id !== attributeId) return attr;
      
      return {
        ...attr,
        values: attr.values.filter(v => v.id !== valueId)
      };
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="New attribute (e.g., Color, Size)"
          value={newAttributeName}
          onChange={(e) => setNewAttributeName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addAttribute();
            }
          }}
          className="max-w-xs"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAttribute}
          disabled={!newAttributeName.trim()}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      
      {attributes.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Attribute</TableHead>
              <TableHead>Values</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.map((attribute) => (
              <TableRow key={attribute.id}>
                <TableCell className="font-medium">{attribute.name}</TableCell>
                <TableCell>
                  {editingAttributeId === attribute.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={`Add ${attribute.name} value`}
                        value={newAttributeValue}
                        onChange={(e) => setNewAttributeValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAttributeValue(attribute.id);
                          }
                        }}
                        className="max-w-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addAttributeValue(attribute.id)}
                        disabled={!newAttributeValue.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAttributeId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {attribute.values.map((value) => (
                        <Badge 
                          key={value.id} 
                          variant="outline"
                          className="group flex items-center gap-1"
                        >
                          {value.value}
                          <button
                            type="button"
                            onClick={() => removeAttributeValue(attribute.id, value.id)}
                            className="h-3 w-3 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {attribute.values.length === 0 && (
                        <span className="text-muted-foreground text-sm italic">No values</span>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 rounded-full"
                        onClick={() => setEditingAttributeId(attribute.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttribute(attribute.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="border rounded-md flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-muted-foreground">No attributes defined yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add attributes like Size, Color, Material to create product variants
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
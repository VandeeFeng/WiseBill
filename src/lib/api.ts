import { supabase } from './supabase'

interface Transaction {
  account: string
  amount: number
  date: string
  description: string | null
}

// Sample data to display when no author key is provided or key is invalid
const sampleTransactions = [
  {
    id: 1,
    account: "工商银行",
    amount: 199.99,
    date: new Date().toISOString(),
    description: "购物"
  },
  {
    id: 2,
    account: "招商银行",
    amount: 88.50,
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    description: "餐饮"
  },
  {
    id: 3,
    account: "建设银行",
    amount: 35.00,
    date: new Date(Date.now() - 172800000).toISOString(), // Day before yesterday
    description: "交通"
  }
];

// Create a function to validate keys on the server side via RPC
// This avoids exposing the key in the frontend code
export async function validateAuthorKey(key: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('validate_author_key', { key_to_validate: key });
    if (error) {
      return false;
    }
    return data === true;
  } catch (error) {
    return false;
  }
}

export async function getTransactions(authorKey?: string) {
  if (!authorKey) {
    return sampleTransactions;
  }
  
  try {
    // Validate key through secure RPC call
    const isValid = await validateAuthorKey(authorKey);
    
    if (!isValid) {
      return sampleTransactions;
    }
    
    // Get transactions if key is valid
    const { data, error } = await supabase
      .from('bill')
      .select('*')
      .order('Date', { ascending: false });

    if (error) {
      return sampleTransactions;
    }

    if (!data || data.length === 0) {
      return sampleTransactions;
    }

    return data.map(item => ({
      id: item.id,
      account: item.Account || '',
      amount: item.Amount || 0,
      date: item.Date || new Date().toISOString(),
      description: item.Description || null,
      created_at: item.created_at
    }));
  } catch (error) {
    return sampleTransactions;
  }
}

export async function createTransaction(transaction: Transaction, authorKey?: string) {
  if (!authorKey) {
    throw new Error("Valid author key is required to create transactions");
  }
  
  try {
    // Validate key through secure RPC call
    const isValid = await validateAuthorKey(authorKey);
    
    if (!isValid) {
      throw new Error("Valid author key is required to create transactions");
    }
    
    // Create transaction if key is valid
    const { error } = await supabase
      .from('bill')
      .insert([{
        Account: transaction.account,
        Amount: transaction.amount,
        Date: new Date(transaction.date).toISOString(),
        Description: transaction.description
      }]);
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
}

export async function updateTransaction(id: string, transaction: Partial<Transaction>, authorKey?: string) {
  if (!authorKey) {
    throw new Error("Valid author key is required to update transactions");
  }
  
  try {
    // Validate key through secure RPC call
    const isValid = await validateAuthorKey(authorKey);
    
    if (!isValid) {
      throw new Error("Valid author key is required to update transactions");
    }
    
    // Update transaction if key is valid
    const { error } = await supabase
      .from('bill')
      .update({
        Account: transaction.account,
        Amount: transaction.amount,
        Date: transaction.date ? new Date(transaction.date).toISOString() : undefined,
        Description: transaction.description
      })
      .eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
} 
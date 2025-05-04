import { supabase } from './supabase'

interface Transaction {
  银行名称: string
  消费金额: number
  消费时间: string
  消费用途: string | null
}

// Sample data to display when no author key is provided or key is invalid
const sampleTransactions = [
  {
    id: 1,
    银行名称: "工商银行",
    消费金额: 199.99,
    消费时间: new Date().toISOString(),
    消费用途: "购物"
  },
  {
    id: 2,
    银行名称: "招商银行",
    消费金额: 88.50,
    消费时间: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    消费用途: "餐饮"
  },
  {
    id: 3,
    银行名称: "建设银行",
    消费金额: 35.00,
    消费时间: new Date(Date.now() - 172800000).toISOString(), // Day before yesterday
    消费用途: "交通"
  }
];

// Create a function to validate keys on the server side via RPC
// This avoids exposing the key in the frontend code
export async function validateAuthorKey(key: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('validate_author_key', { key_to_validate: key });
    if (error) {
      console.error("Error validating key:", error);
      return false;
    }
    return data === true;
  } catch (error) {
    console.error("Error in validateAuthorKey:", error);
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
      .order('消费时间', { ascending: false });
    
    if (error) {
      console.error("Error fetching transactions:", error);
      return sampleTransactions;
    }
    
    return data || sampleTransactions;
  } catch (error) {
    console.error("Error in getTransactions:", error);
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
        ...transaction,
        消费时间: new Date(transaction.消费时间).toISOString()
      }]);
    
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
} 
// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding
const intellifyIndex = pc.Index('intellify')

async function createMemory({ vectors, metadata }) {
    await intellifyIndex.upsert([{
        id: messageId,
        values: vectors,
        metadata
    }])
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
    const data = await intellifyIndex.query({
        vector: queryVector,
        topk: limit,     // topk means vector space me us point ke paas jo sabse closest hai
        filter: metadata ? { metadata } : undefined
    })
}
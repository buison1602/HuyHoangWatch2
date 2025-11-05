(async () => {
  const urls = [
    'http://localhost:3000/shop',
    'http://localhost:3000/api/products?page=2&pageSize=12',
    'http://localhost:3000/api/products?page=1&pageSize=12'
  ]

  for (const u of urls) {
    try {
      const res = await fetch(u)
      console.log(`${u} -> ${res.status}`)
    } catch (err) {
      console.error(`error fetching ${u}:`, err.message || err)
    }
    // small delay
    await new Promise(r => setTimeout(r, 600))
  }

  console.log('done')
})()

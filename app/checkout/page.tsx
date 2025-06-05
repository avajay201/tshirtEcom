"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, MapPin, Minus, Trash2, CheckCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { saveAddresses, userAddresses, editAddresses, shippingCharges as getShippingCharges } from "@/action/APIAction"
import { LoaderOverlay } from "@/components/ui/LoaderOverlay"


export default function CheckoutPage() {
  const { items, updateQuantity, removeItem, total, isLoading: cartLoading } = useCart()
  const router = useRouter()
  const [savedAddresses, setSavedAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setsuccess] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [purchaseToItem, setPurchaseToItem] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone_number: '',
    alt_phone_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
  });
  const queryParams = useSearchParams();
  const productVariantID = queryParams.get('p') || '';
  const [shippingCharges, setShippingCharges] = useState(0);
  const [estimateDeliveryDate, setEstimateDeliveryDate] = useState(null);

  useEffect(() => {
    if (items.length === 0 && !cartLoading) {
      router.push("/")
    }
    else{
      if (productVariantID){
        const product = items.filter(item => item.variant == productVariantID)
        if (product.length > 0){
          setPurchaseToItem(product[0])
        }
        else{
          router.push("/")
        }
      }
    }
    
  }, [items]);

  const INDIAN_STATES_AND_UTS = [
    ["Andhra Pradesh", "Andhra Pradesh"],
    ["Arunachal Pradesh", "Arunachal Pradesh"],
    ["Assam", "Assam"],
    ["Bihar", "Bihar"],
    ["Chhattisgarh", "Chhattisgarh"],
    ["Goa", "Goa"],
    ["Gujarat", "Gujarat"],
    ["Haryana", "Haryana"],
    ["Himachal Pradesh", "Himachal Pradesh"],
    ["Jharkhand", "Jharkhand"],
    ["Karnataka", "Karnataka"],
    ["Kerala", "Kerala"],
    ["Madhya Pradesh", "Madhya Pradesh"],
    ["Maharashtra", "Maharashtra"],
    ["Manipur", "Manipur"],
    ["Meghalaya", "Meghalaya"],
    ["Mizoram", "Mizoram"],
    ["Nagaland", "Nagaland"],
    ["Odisha", "Odisha"],
    ["Punjab", "Punjab"],
    ["Rajasthan", "Rajasthan"],
    ["Sikkim", "Sikkim"],
    ["Tamil Nadu", "Tamil Nadu"],
    ["Telangana", "Telangana"],
    ["Tripura", "Tripura"],
    ["Uttar Pradesh", "Uttar Pradesh"],
    ["Uttarakhand", "Uttarakhand"],
    ["West Bengal", "West Bengal"],
    ["Andaman and Nicobar Islands", "Andaman and Nicobar Islands"],
    ["Chandigarh", "Chandigarh"],
    ["Dadra and Nagar Haveli and Daman and Diu", "Dadra and Nagar Haveli and Daman and Diu"],
    ["Delhi", "Delhi"],
    ["Jammu and Kashmir", "Jammu and Kashmir"],
    ["Ladakh", "Ladakh"],
    ["Lakshadweep", "Lakshadweep"],
    ["Puducherry", "Puducherry"],
  ].sort((a, b) => a[0].localeCompare(b[0]))

  const fetchAddresses = async () => {
    const savedAddresses = await userAddresses();
    setisLoading(false);
    if (savedAddresses) {
      setSavedAddresses(savedAddresses);
    }
  }

  useEffect(() => {
    fetchAddresses();
  }, []);

  const validateAddress = (address) => {
    const errors = {};

    if (!address.full_name.trim()) errors.full_name = ["Full name is required"];

    if (!address.phone_number.trim()) {
      errors.phone_number = ["Phone number is required"];
    } else if (!/^\d{10}$/.test(address.phone_number)) {
      errors.phone_number = ["Phone number must be 10 digits"];
    }

    if (!address.address_line1.trim()) errors.address_line1 = ["Address Line 1 is required"];

    if (!address.city.trim()) errors.city = ["City is required"];

    if (!address.state.trim()) errors.state = ["State is required"];

    if (!address.postal_code.trim()) {
      errors.postal_code = ["Postal code is required"];
    } else if (!/^\d{6}$/.test(address.postal_code)) {
      errors.postal_code = ["Postal code must be 6 digits"];
    }

    return errors;
  };

  const saveNewAddresses = async () => {
    setError(null);
    setsuccess(null);
    const clientSideErrors = validateAddress(newAddress);

    if (Object.keys(clientSideErrors).length > 0) {
      setValidationErrors(clientSideErrors);
      return;
    }

    setValidationErrors({});

    setisLoading(true);

    let isError = false;

    if (editingAddressId) {
      const result = await editAddresses({ ...newAddress, id: editingAddressId });

      if (result[0] === 200) {
        const updatedList = savedAddresses.map(addr =>
          addr.id === editingAddressId ? result[1].address : addr
        );
        setSavedAddresses(updatedList);
        setsuccess(result[1].message);
      } else {
        setError(result[1]);
        isError = true;
      }
    }
    else{
      const result = await saveAddresses(newAddress)
  
      if (result[0] === 201) {
        setSavedAddresses([...savedAddresses, result[1].address])
        setsuccess(result[1].message)
      } else {
        setError(result[1])
        isError = true;
      }
    }

    setisLoading(false);

    if (isError) return;

    setShowAddressForm(false)
    setNewAddress({
      full_name: '',
      phone_number: '',
      alt_phone_number: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
    })
    setTimeout(()=>{
      setsuccess(null)
    }, 1500)
  }

  const handleCheckout = () => {
    setAddressError(null);
    if (!selectedAddress){
      setAddressError('Please select a delivery address');
      return
    }
    alert("Checkout flow to be implemented")
  }

  const fetchShippingCharges = async (id)=>{
    setAddressError(null);
    setisLoading(true);
    const addr = savedAddresses.filter(addr => addr.id === id)[0]
    const result = await getShippingCharges({p: showToItems.length, d_pc: addr.postal_code});
    setisLoading(false);
    if (result){
      setShippingCharges(result.charges)
      setEstimateDeliveryDate(result.etd)
    }
    else{
      setAddressError('Something went wrong.');
    }
  }

  const handleAddressSelection = (address)=>{
    setSelectedAddress(address.id);
    fetchShippingCharges(address.id);
    resetAddressForm();
  }

  const resetAddressForm = ()=>{
    setShowAddressForm(false);
    setEditingAddressId(null);
    setNewAddress({
      full_name: '',
      phone_number: '',
      alt_phone_number: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
    });
    setValidationErrors({});
    setError(null);
    setsuccess(null);
  }

  const grandTotal = purchaseToItem ? (purchaseToItem.price * purchaseToItem.quantity) : total
  const showToItems = purchaseToItem ? [purchaseToItem] : items

  return (
    <>
      {(cartLoading || isLoading) && <LoaderOverlay />}
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Delivery Addresses</div>
                {addressError && <div className="text-red-500 text-sm">{addressError}</div>}
              </h2>

              {savedAddresses && savedAddresses.length > 0 ? (
                <div className="space-y-4">
                  {savedAddresses.map((address, index) => (
                    <div
                      key={index}
                      style={{borderWidth: selectedAddress === address.id ? 2: 1}}
                      className={`relative border rounded-lg p-4 hover:border-purple-500 cursor-pointer ${selectedAddress === address.id && "border-purple-500"}`}
                      onClick={()=>handleAddressSelection(address)}
                    >
                      {selectedAddress === address.id && (
                        <CheckCircle
                          className="absolute top-2 right-2 text-purple-600"
                          size={20}
                        />
                      )}
                      {selectedAddress === address.id && <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingAddressId(address.id);
                          setShowAddressForm(true);
                          setNewAddress(address);
                        }}
                        style={{right: '3rem'}}
                        className="absolute top-2 right-2 text-blue-600 text-sm underline"
                      >
                        Edit
                      </button>}
                      <p className="font-medium">{address.full_name}</p>
                      <p className="text-sm text-gray-600">{address.address_line1}, {address.address_line2 && address.address_line2 + ','} {address.city}, {address.state} - {address.postal_code}</p>
                      <p className="text-sm text-gray-600">Phone: {address.phone_number}{address.alt_phone_number && ', ' + address.alt_phone_number}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 mb-4">
                  No saved addresses. Please add one to proceed.
                </div>
              )}

              {!showAddressForm ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowAddressForm(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              ) : (
                <Card className="mt-4">
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={newAddress.full_name}
                          onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                          className="border p-2 rounded"
                        />
                        {validationErrors.full_name && (
                          <p className="text-red-500 text-sm">{validationErrors.full_name[0]}</p>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={newAddress.phone_number}
                          onChange={(e) => setNewAddress({ ...newAddress, phone_number: e.target.value })}
                          className="border p-2 rounded"
                        />
                        {validationErrors.phone_number && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.phone_number[0]}</p>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="text"
                          placeholder="Alt. Phone Number (Optional)"
                          value={newAddress.alt_phone_number}
                          onChange={(e) => setNewAddress({ ...newAddress, alt_phone_number: e.target.value })}
                          className="border p-2 rounded"
                        />
                        {validationErrors.alt_phone_number && (
                          <p className="text-red-500 text-sm">{validationErrors.alt_phone_number[0]}</p>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="text"
                          placeholder="Address Line 1"
                          value={newAddress.address_line1}
                          onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                          className="border p-2 rounded col-span-1 md:col-span-2"
                        />
                        {validationErrors.address_line1 && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.address_line1[0]}</p>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="text"
                          placeholder="Address Line 2 (Optional)"
                          value={newAddress.address_line2}
                          onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                          className="border p-2 rounded col-span-1 md:col-span-2"
                        />
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="border p-2 rounded"
                        />
                        {validationErrors.city && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.city[0]}</p>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <select
                        style={{padding: '10px'}}
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="border p-2 rounded"
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES_AND_UTS.map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        {validationErrors.state && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.state[0]}</p>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <input
                          type="text"
                          placeholder="Postal Code"
                          value={newAddress.postal_code}
                          onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                          className="border p-2 rounded"
                        />
                        {validationErrors.postal_code && (
                          <p className="text-red-500 text-sm mt-1">{validationErrors.postal_code[0]}</p>
                        )}
                      </div>
                    </div>

                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="ghost"
                        onClick={resetAddressForm}
                        className="text-red-500"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={saveNewAddresses}
                      >
                        {editingAddressId ? 'Save Changes' : 'Save Address'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              {success && <div className="text-green-500 text-sm text-center">{success}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              {showToItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className="flex items-center gap-4"
                >
                  <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} | Color: {item.color}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => item.quantity < item.stock && updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Max Stock Notice */}
                    {item.quantity >= item.stock && (
                      <p className="text-xs text-red-500">Max stock limit reached ({item.stock})</p>
                    )}
                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-purple-600">
                      ₹{(item.quantity * item.price).toFixed(2)}
                    </p>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeItem(item.variant)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold mb-2">Price Details</h2>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">{!error && !addressError && selectedAddress ? (shippingCharges ? '₹'+shippingCharges : 'Free') : '-'}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{!error && !addressError && selectedAddress ? `₹${(grandTotal + shippingCharges).toFixed(2)}` : '-'}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                size="lg"
                disabled={!error && !addressError && selectedAddress ? false : true }
                onClick={() => (!error && !addressError && selectedAddress) && handleCheckout()}
              >
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

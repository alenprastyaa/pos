import{j as Et,r as l,c as F,y as Ht,o as At,b as c,a as Mt,w as Rt,d as a,p as tt,v as it,u as qt,e as m,F as V,h as O,q as S,z as Kt,n as D,t as o,f as et,B as Lt,x as rt,i as Ft,A as U}from"./index-DxYj3GZT.js";import{a as K,S as r}from"./sweetalert2.esm.all-BgBW3QO9.js";import{_ as Vt}from"./AdminLayout-CGlUXVYQ.js";import{_ as Ot}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Ut={class:"page-container min-h-screen py-2 space-y-2"},Gt={class:"grid grid-cols-1 lg:grid-cols-3 gap-4"},Jt={class:"lg:col-span-2 relative"},Yt=["disabled"],Qt={key:0,class:"dropdown-container absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-10 max-h-200 overflow-y-auto"},Wt=["onClick"],Xt={style:{"font-size":"14px"},class:"dropdown-text space-y-1 border border-gray-200 p-2"},Zt={class:"font-semibold"},te={class:"text-green-600 font-medium"},ee={key:0,disabled:""},ae=["value"],ne={key:0,class:"card-section p-4 rounded-lg border"},se={class:"flex justify-between items-center"},le={key:1,class:"space-y-3"},oe={class:"flex items-center gap-2"},ie={class:"text-sm font-bold text-title"},re={class:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"},de={class:"mb-3"},ue={class:"text-sm font-semibold text-title"},ce={class:"text-lg font-bold text-warning mt-1"},pe={class:"text-xs text-muted mt-2"},me={class:"flex gap-2 justify-end"},ge=["onClick"],ve=["onClick"],fe={class:"card-section rounded-lg shadow-sm border overflow-hidden"},be={class:"overflow-x-auto"},ye={class:"w-full"},xe={class:"divide-y divide-border"},he={key:0},ke={class:"px-6 py-1 text-sm text-body font-medium"},_e={class:"px-6 py-1"},we={style:{"font-size":"12px"},class:"text-body leading-tight"},Te={class:"px-6 py-1 text-center"},Be=["onUpdate:modelValue","onChange"],Pe={class:"px-6 py-1 text-right text-sm text-muted-dark"},je={class:"px-6 py-1 text-right text-sm font-semibold text-body"},Ce={class:"px-6 py-1 text-center"},$e=["onClick"],Ie={class:"px-6 py-2 bg-footer border-t flex justify-between items-center"},Se={class:"text-xl text-primary"},De={class:"space-y-4 mt-4"},Ne={class:"relative"},ze=["value"],Ee={class:"card-section p-5 border rounded-lg space-y-3"},He={class:"flex justify-between text-sm"},Ae={class:"flex justify-between text-sm"},Me={class:"font-semibold text-body"},Re={class:"flex justify-between text-sm border-t pt-3 border-divider"},qe={class:"font-semibold text-body"},Ke={class:"grid grid-cols-1 md:grid-cols-3 gap-4"},Le=["disabled"],Fe={key:0,class:"animate-spin h-5 w-5",fill:"none",viewBox:"0 0 24 24"},Ve=["disabled"],dt="pendingTransactions",Oe=Et({__name:"PenjualanGrosir",setup(Ue){const ut=Ft(),N="https://alentest.my.id/pos",k=l(0),ct=localStorage.getItem("role_name"),v=l(-1),G=l([]),J=l(!1),z=l(!1),p=l(""),g=l(0),pt=l(""),L=l(null),d=l([]),x=l([]),B=l(null),P=l(null),E=l(""),f=l([]),_=l(!1),H=()=>({Authorization:`Bearer ${localStorage.getItem("authToken")}`}),mt=F(()=>{var t;return((t=P.value)==null?void 0:t.role_name)==="superadmin"});l([]);const gt=l("");l(!1);const A=l(""),Y=F(()=>{const t=Number(k.value)||0,e=Number(w.value)||0;return t+e}),at=l(null),Q=l(null),vt=t=>{/\d/.test(t.key)&&t.preventDefault()},ft=t=>{const e=t.replace(/\D/g,""),n=parseInt(e)||0;g.value=n,e===""?A.value="":A.value=new Intl.NumberFormat("id-ID").format(n)},bt=t=>{const e=t.target;ft(e.value)},yt=t=>{const e=t.target;g.value>0&&(e.value=g.value.toString())},xt=t=>{const e=t.target;g.value>0&&(e.value=A.value)},ht=t=>{t.key==="Enter"&&(t.preventDefault(),U(()=>{var e,n;(e=Q.value)==null||e.focus(),(n=Q.value)==null||n.click()}))},kt=async t=>{if(!t.trim()){f.value=[],_.value=!1;return}try{const e=await K.get(`${N}/produk`,{params:{search:t},headers:H()});e.data.success&&e.data.data.data&&(f.value=e.data.data.data.map(n=>({barcode:n.barcode,qty:1,nama_produk:n.nama_produk,harga_jual_ritel:parseFloat(n.harga_jual_ritel)})),_.value=!0,v.value=-1)}catch(e){console.error("Error searching products:",e),f.value=[]}},_t=t=>{if(!(!_.value||f.value.length===0))switch(t.key){case"ArrowDown":t.preventDefault(),v.value=Math.min(v.value+1,f.value.length-1);break;case"ArrowUp":t.preventDefault(),v.value=Math.max(v.value-1,-1);break;case"Enter":t.preventDefault(),v.value>=0&&nt(f.value[v.value]);break;case"Escape":t.preventDefault(),_.value=!1,v.value=-1;break}},nt=async t=>{const e=await zt(t);e!==null&&(Pt(t,e),r.fire({icon:"success",title:"Berhasil",text:`${e} ${t.nama_produk} ditambahkan`,timer:1500,showConfirmButton:!1})),E.value="",f.value=[],_.value=!1,v.value=-1,U(()=>{var n;(n=L.value)==null||n.focus()})},i=t=>t==null||isNaN(t)?"Rp 0":new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(t),wt=t=>new Date(t).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),w=F(()=>d.value.reduce((t,e)=>t+e.qty*e.harga_jual_ritel,0)),j=F(()=>{const t=Number(g.value)||0,e=Number(Y.value)||0;return t-e}),Tt=async()=>{try{const t=await K.get(`${N}/user/my/data`,{headers:H()});t.data.success&&(P.value={full_name:t.data.data.full_name,role_name:t.data.data.role_name,toko:{id:t.data.data.toko.id,nama_toko:t.data.data.toko.nama_toko,alamat:t.data.data.toko.alamat}})}catch(t){console.error("Gagal mengambil data kasir:",t)}},st=async t=>{try{const e=await K.get(`${N}/pelanggan/${t}`,{headers:H()});e.data.success&&e.data.data&&(k.value=Number(e.data.data.hutang)||0)}catch(e){console.error("Gagal mengambil hutang pelanggan:",e),k.value=0}};Ht(p,async t=>{t?(await st(t),U(()=>{var e;(e=at.value)==null||e.focus()})):k.value=0});const Bt=async()=>{J.value=!0;try{const t=await K.get(`${N}/pelanggan`,{headers:H()});t.data.success&&(G.value=t.data.data)}catch(t){console.error("Gagal mengambil data pelanggan:",t)}finally{J.value=!1}},W=()=>{p.value="",g.value=0,A.value="",d.value=[],pt.value="",B.value=null,U(()=>{var t;(t=L.value)==null||t.focus(),E.value="",f.value=[],_.value=!1})},Pt=(t,e=1)=>{const n=d.value.find(s=>s.barcode===t.barcode);n?(n.qty+=e,d.value=[n,...d.value.filter(s=>s.barcode!==t.barcode)]):d.value.unshift({barcode:t.barcode,qty:e,nama_produk:t.nama_produk,harga_jual_ritel:parseFloat(t.harga_jual_ritel)})},jt=(t,e)=>{const n=d.value.find(s=>s.barcode===t);n&&(e<=0||isNaN(e)?lt(t):n.qty=e)},lt=t=>{d.value=d.value.filter(e=>e.barcode!==t)},ot=()=>{try{localStorage.setItem(dt,JSON.stringify(x.value))}catch(t){console.error("Error saving pending transactions:",t)}},Ct=()=>{try{const t=localStorage.getItem(dt);x.value=t?JSON.parse(t):[]}catch(t){console.error("Error loading pending transactions:",t),x.value=[]}},$t=async()=>{if(d.value.length===0){r.fire("Peringatan","Keranjang belanja kosong.","warning");return}if(!p.value){r.fire("Peringatan","Pelanggan harus dipilih untuk menyimpan transaksi pending.","warning");return}const t=G.value.find(s=>s.id===p.value),e=t?t.nama_pelanggan:"Pelanggan Tidak Dikenal",n={id:Date.now(),pelanggan_id:p.value,nama_pelanggan:e,items:[...d.value],tanggal_simpan:new Date().toLocaleString("id-ID"),total:w.value};x.value.push(n),ot(),r.fire("Berhasil","Transaksi telah disimpan sebagai pending.","success"),W()},It=t=>{W(),p.value=t.pelanggan_id,d.value=t.items,g.value=0,B.value=t.id,r.fire("Dimuat",`Transaksi untuk ${t.nama_pelanggan} telah dimuat ke keranjang.`,"info"),X(B.value,!1)},X=(t,e=!0)=>{x.value=x.value.filter(n=>n.id!==t),ot(),e&&r.fire("Berhasil","Transaksi pending telah dihapus.","success")},St=(t,e,n,s,b,C)=>{const $=t.total_bayar,u=t.total_harga,T=t.total_kembalian,I=t.sisa_hutang,h=y=>new Intl.NumberFormat("id-ID",{minimumFractionDigits:0}).format(y);return`
        <div style="
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000; 
            width: 100%;
            padding-left: 30px; /* PENTING: Jarak aman agar kiri tidak potong */
            padding-right: 5px;
        ">
            <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-size: 14px; margin-bottom: 5px;">${b.toUpperCase()}</div>
                <div style="font-size: 10px; line-height: 1.2;">
                    ${C.replace(/\n/g,"<br>")}
                </div>
            </div>

            <div style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 5px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>ID: ${t.id.substring(0,8)}</span>
                    <span>${wt(t.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 2px;">
                    <span>Kasir: ${s}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Plg: ${e}</span>
                </div>
            </div>

            <div style="display: flex; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 5px; font-size: 10px;">
                <span style="flex: 1; text-align: left;">ITEM</span>
                <span style="width: 25px; text-align: center;">Qty</span>
                <span style="width: 55px; text-align: right;">Hrg</span>
                <span style="width: 60px; text-align: right;">Total</span>
            </div>

            <div style="margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 5px;">
                ${n.map(y=>`
                    <div style="margin-bottom: 4px;">
                        <div style="margin-bottom: 1px;">
                            ${y.nama_produk}
                        </div>
                        <div style="display: flex; font-size: 10px;">
                            <span style="flex: 1;"></span> <span style="width: 25px; text-align: center;">${y.qty}</span>
                            <span style="width: 55px; text-align: right;">${h(y.harga_jual_ritel)}</span>
                            <span style="width: 60px; text-align: right;">${h(y.qty*y.harga_jual_ritel)}</span>
                        </div>
                    </div>
                `).join("")}
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 12px;">
                    <span>TOTAL:</span>
                    <span>Rp ${h(u)}</span>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                    <span>Tunai:</span>
                    <span>Rp ${h($)}</span>
                </div>
                
                ${T>0?`
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                        <span>Kembali:</span>
                        <span>Rp ${h(T)}</span>
                    </div>
                `:""}

                ${I>0?`
                    <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px;">
                        <span>SISA HUTANG:</span>
                        <span>Rp ${h(I)}</span>
                    </div>
                `:""}
            </div>

            <div style="margin-top: 15px; text-align: center; font-size: 10px;">
                <div>Terima Kasih</div>
                <div style="margin-top: 2px;">Barang yang dibeli tidak dapat ditukar/dikembalikan</div>
            </div>
        </div>
    `},Dt=(t,e,n,s,b,C)=>{const $=St(t,e,n,s,b,C),u=window.open("","","width=400,height=600");if(!u){r.fire("Error","Gagal membuka jendela cetak. Periksa setelan pop-up browser Anda.","error");return}u.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Struk #${t.id.substring(0,8)}</title>
                <style>
                    /* Reset CSS */
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    body { 
                        font-family: Arial, Helvetica, sans-serif;
                        background: #fff;
                        color: #000;
                    }

                    /* PENTING: CSS Print */
                    @media print {
                        @page {
                            margin: 0; /* Hapus margin browser */
                            size: auto;
                        }
                        
                        body {
                            /* Padding CSS mengambil alih margin fisik */
                            width: 100%;
                        }
                    }
                </style>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 1000);">
                ${$}
            </body>
        </html>
    `),u.document.close()},Nt=async()=>{var C,$;if(!p.value){r.fire("Peringatan","Pelanggan harus dipilih.","warning");return}if(d.value.length===0){r.fire("Peringatan","Keranjang belanja kosong.","warning");return}if(!P.value){r.fire("Error","Data kasir/toko belum dimuat. Mohon refresh halaman atau cek koneksi API.","error");return}if(mt.value&&!gt.value){r.fire("Peringatan","Toko harus dipilih untuk melakukan penjualan.","warning");return}if(!(await r.fire({icon:"question",title:"Konfirmasi Transaksi",html:`<div class="text-left">
                   <p class="mb-3"><strong>Total Belanja:</strong> ${i(w.value)}</p>
                   <p class="mb-3"><strong>Uang Bayar:</strong> ${i(g.value)}</p>
                   <p class="mb-4"><strong>Kembalian/Hutang:</strong> <span class="${j.value<0?"text-red-600 font-bold ":"text-green-600 font-bold"}">${i(Math.abs(j.value))}</span></p>
                   <hr class="my-3">
                   <p class="text-sm text-gray-600">Periksa kembali data di atas sebelum melanjutkan.</p>
               </div>`,showCancelButton:!0,confirmButtonText:"Ya, Lanjutkan",cancelButtonText:"Batalkan",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1,allowEscapeKey:!1})).isConfirmed)return;const e=j.value;if(e<0){const u=Math.abs(e);if(!(await r.fire({icon:"warning",title:"Kurang Bayar!",html:`<p>Pembayaran <strong>kurang</strong> sebesar <strong>${i(u)}</strong>.</p>
                   <p class="mt-2 text-red-500 font-semibold">Transaksi ini akan dicatat sebagai <strong>Hutang</strong>.</p>
                   <p class="text-sm mt-3">Lanjutkan proses transaksi?</p>`,showCancelButton:!0,confirmButtonText:"Ya, Catat Hutang",cancelButtonText:"Batalkan Transaksi",confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",allowOutsideClick:!1,allowEscapeKey:!1})).isConfirmed)return}const n=[...d.value],s=d.value.map(u=>({barcode:u.barcode,qty:u.qty})),b={pelanggan_id:p.value,pembayaran:g.value,items:s};z.value=!0;try{const u=await K.post(`${N}/transaksi/create/ritel`,b,{headers:H()});if(u.data.success){const T=u.data.data.transaksi,I=T.sisa_hutang||0,h=T.total_kembalian||0,y=u.data.data.pelanggan.nama_pelanggan;Dt(T,y,n,P.value.full_name,P.value.toko.nama_toko,P.value.toko.alamat);let M,R,q;I>0?(q="warning",M="Transaksi Tercatat sebagai Hutang!",R=`<p class="text-lg font-bold mt-2">Pelanggan: ${y}</p>
                   <p class="text-xl font-bold mt-1 text-red-600">Sisa Hutang: ${i(I)}</p>`):I===0?(h>0?(q="success",M="Transaksi Berhasil!",R=`<p class="text-lg font-bold mt-2">Total Belanja: ${i(w.value)}</p>
                       <p class="text-lg font-bold mt-1">Uang Bayar: ${i(g.value)}</p>
                       <p class="text-xl font-bold mt-2 text-green-600">Kembalian: ${i(h)}</p>`):(q="success",M="Transaksi Berhasil!",R='<p class="text-lg font-bold mt-2">Pembayaran Lunas Pas!</p>'),ut.push("/penjualan-grosir")):(q="error",M="Error Logika Transaksi!",R='<p class="text-lg font-bold mt-2">Terdeteksi error internal. Hubungi Admin.</p>'),r.fire({icon:q,title:M,html:R,confirmButtonText:"OK",confirmButtonColor:"#0891b2",allowOutsideClick:!1,allowEscapeKey:!1,didOpen:()=>{const Z=document.querySelector(".swal2-confirm");Z&&Z.focus()}}).then(Z=>{B.value!==null&&X(B.value,!1),st(p.value),W()})}else r.fire({icon:"error",title:"Transaksi Gagal",text:u.data.message||"Terjadi kesalahan saat memproses transaksi."})}catch(u){console.error("Error transaksi:",u),r.fire({icon:"error",title:"Error",text:(($=(C=u.response)==null?void 0:C.data)==null?void 0:$.message)||"Gagal terhubung ke server."})}finally{z.value=!1}},zt=async t=>{const e=await r.fire({title:"Jumlah Barang",html:`
            <p class="mb-3 text-gray-700 font-medium">${t.nama_produk}</p>
            <input id="qty-input" type="number" min="1" value="1" 
                class="swal2-input w-full text-center text-lg font-bold text-gray-800" 
                autofocus>
        `,showCancelButton:!0,confirmButtonText:"Tambahkan",cancelButtonText:"Batal",confirmButtonColor:"#0891b2",cancelButtonColor:"#6b7280",allowOutsideClick:!1,didOpen:()=>{const n=document.getElementById("qty-input");n&&(n.focus(),n.select(),n.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),r.clickConfirm())}))},preConfirm:()=>{const n=document.getElementById("qty-input"),s=parseInt(n.value);return!s||s<=0||isNaN(s)?(r.showValidationMessage("Masukkan jumlah yang valid (minimal 1)"),!1):s}});return e.isConfirmed&&e.value?e.value:null};return At(async()=>{var t;await Tt(),await Bt(),Ct(),(t=L.value)==null||t.focus()}),(t,e)=>(c(),Mt(Vt,null,{default:Rt(()=>[a("div",Ut,[a("div",Gt,[a("div",Jt,[e[3]||(e[3]=a("label",{class:"block text-sm font-medium label-text mb-2"}," Cari Produk ",-1)),tt(a("input",{onKeypress:vt,ref_key:"barcodeInputRef",ref:L,"onUpdate:modelValue":e[0]||(e[0]=n=>E.value=n),type:"text",style:{"font-size":"12px"},placeholder:"Ketik nama produk...",onInput:e[1]||(e[1]=n=>kt(E.value)),onKeydown:_t,disabled:qt(ct)!=="admin",class:"input-field w-full h-8 px-4 rounded-lg transition"},null,40,Yt),[[it,E.value]]),_.value&&f.value.length>0?(c(),m("div",Qt,[(c(!0),m(V,null,O(f.value,(n,s)=>(c(),m("div",{key:n.barcode,onClick:b=>nt(n),class:D([s===v.value?"dropdown-item-active":"dropdown-item","px-2 py-1 cursor-pointer last:border-b-0 transition"])},[a("div",Xt,[a("div",Zt,o(n.nama_produk),1),a("div",te,o(i(n.harga_jual_ritel)),1)])],10,Wt))),128))])):S("",!0)]),a("div",null,[e[5]||(e[5]=a("label",{class:"block text-sm font-medium label-text mb-2"}," Pilih Pelanggan ",-1)),tt(a("select",{"onUpdate:modelValue":e[2]||(e[2]=n=>p.value=n),required:"",style:{"font-size":"12px"},class:"input-field w-full h-8 rounded-lg px-4 transition"},[e[4]||(e[4]=a("option",{value:"",disabled:""},"Pilih Pelanggan...",-1)),J.value?(c(),m("option",ee,"Memuat...")):S("",!0),(c(!0),m(V,null,O(G.value,n=>(c(),m("option",{key:n.id,value:n.id},o(n.nama_pelanggan),9,ae))),128))],512),[[Kt,p.value]])])]),p.value?(c(),m("div",ne,[a("div",se,[e[6]||(e[6]=a("span",{class:"text-sm font-medium text-muted"},"Hutang Pelanggan",-1)),a("span",{class:D(["text-lg",k.value>0?"text-danger":"text-success"])},o(i(k.value)),3)])])):S("",!0),x.value.length>0?(c(),m("div",le,[a("div",oe,[e[7]||(e[7]=a("div",{class:"w-1 h-6 indicator-bar rounded"},null,-1)),a("p",ie," Transaksi Pending ("+o(x.value.length)+") ",1)]),a("div",re,[(c(!0),m(V,null,O(x.value,n=>(c(),m("div",{key:n.id,class:D(["p-4 border-2 rounded-lg transition cursor-pointer pending-card",n.id===B.value?"pending-card-active":"pending-card-inactive"])},[a("div",de,[a("p",ue,o(n.nama_pelanggan),1),a("p",ce,o(i(n.total)),1),a("p",pe,o(n.tanggal_simpan),1)]),a("div",me,[a("button",{onClick:s=>It(n),class:"btn-primary-small text-sm px-3 py-1.5 rounded-md font-medium transition"}," Muat ",8,ge),a("button",{onClick:s=>X(n.id),class:"btn-secondary-small text-sm px-3 py-1.5 rounded-md font-medium transition"}," Hapus ",8,ve)])],2))),128))])])):S("",!0),a("div",fe,[a("div",be,[a("table",ye,[e[10]||(e[10]=a("thead",null,[a("tr",{class:"table-header border-b"},[a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-left uppercase tracking-wider th-text"},"No"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-left uppercase tracking-wider th-text"},"Produk"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-center uppercase tracking-wider th-text"},"Qty"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-right uppercase tracking-wider th-text"},"Harga"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-right uppercase tracking-wider th-text"},"Subtotal"),a("th",{style:{"font-size":"12px"},class:"px-6 py-4 text-center uppercase tracking-wider th-text"})])],-1)),a("tbody",xe,[d.value.length===0?(c(),m("tr",he,e[8]||(e[8]=[a("td",{colspan:"6",class:"px-6 py-12 text-center text-muted-light"},[a("div",{class:"space-y-2"},[a("svg",{class:"w-12 h-12 mx-auto opacity-40",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"1.5",d:"M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"})]),a("p",{class:"text-sm"},"Belum ada produk ditambahkan")])],-1)]))):S("",!0),(c(!0),m(V,null,O(d.value,(n,s)=>(c(),m("tr",{key:n.barcode,class:"table-row-hover transition"},[a("td",ke,o(s+1),1),a("td",_e,[a("div",we,o(n.nama_produk),1)]),a("td",Te,[tt(a("input",{"onUpdate:modelValue":b=>n.qty=b,type:"number",min:"1",onChange:b=>jt(n.barcode,n.qty),class:"input-qty w-20 text-center border rounded-md px-2 py-1 text-sm transition"},null,40,Be),[[it,n.qty,void 0,{number:!0}]])]),a("td",Pe,o(i(n.harga_jual_ritel)),1),a("td",je,o(i(n.qty*n.harga_jual_ritel)),1),a("td",Ce,[a("button",{type:"button",onClick:b=>lt(n.barcode),class:"btn-icon-delete p-1.5 rounded-md transition"},e[9]||(e[9]=[a("svg",{width:"18",height:"18",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor","stroke-width":"2"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})],-1)]),8,$e)])]))),128))])])]),a("div",Ie,[e[11]||(e[11]=a("span",{class:"text-base text-muted-dark"},"Total Belanja",-1)),a("span",Se,o(i(w.value)),1)])]),a("div",De,[a("div",null,[e[13]||(e[13]=a("label",{class:"block text-sm font-medium label-text mb-2"},[et(" Jumlah Bayar "),a("span",{class:"text-danger"},"*")],-1)),a("div",Ne,[e[12]||(e[12]=a("span",{class:"absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted"},"Rp",-1)),a("input",{ref_key:"pembayaranInputRef",ref:at,value:A.value||g.value||"",onInput:bt,onFocus:yt,onBlur:xt,onKeydown:Lt(ht,["enter"]),type:"text",required:"",placeholder:"0",class:"input-field w-full h-10 pl-12 pr-4 rounded-lg border text-sm transition"},null,40,ze)])]),a("div",Ee,[a("div",He,[e[14]||(e[14]=a("span",{class:"text-muted"},"Hutang Lama:",-1)),a("span",{class:D(["font-semibold",k.value>0?"text-danger":"text-success"])},o(i(k.value)),3)]),a("div",Ae,[e[15]||(e[15]=a("span",{class:"text-muted"},"Total Belanja:",-1)),a("span",Me,o(i(w.value)),1)]),a("div",{class:D(["flex justify-between text-base border-t pt-3 border-divider",Y.value>0?"text-orange-custom":"text-body"])},[e[16]||(e[16]=a("span",null,"Total yang Harus Dibayar:",-1)),a("span",null,o(i(Y.value)),1)],2),a("div",Re,[e[17]||(e[17]=a("span",{class:"text-muted"},"Uang Bayar:",-1)),a("span",qe,o(i(g.value)),1)]),a("div",{class:D(["flex justify-between text-base border-t pt-3 border-divider",j.value>=0?"text-success":"text-danger"])},[a("span",null,o(j.value>=0?"Kembalian":"Sisa Hutang"),1),a("span",null,o(i(Math.abs(j.value))),1)],2)])]),a("div",Ke,[a("button",{ref_key:"submitButtonRef",ref:Q,type:"submit",onClick:rt(Nt,["prevent"]),disabled:z.value||w.value===0||!p.value,class:"md:col-span-2 h-12 btn-submit text-base font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition transform hover:scale-[1.01]"},[z.value?(c(),m("svg",Fe,e[18]||(e[18]=[a("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"},null,-1),a("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"},null,-1)]))):S("",!0),et(" "+o(z.value?"Memproses...":"Proses Transaksi"),1)],8,Le),a("button",{type:"button",onClick:rt($t,["prevent"]),disabled:d.value.length===0||!p.value,class:"btn-pending h-12 font-medium rounded-lg flex items-center justify-center gap-2 transition"},e[19]||(e[19]=[a("svg",{class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","stroke-width":"2"},[a("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})],-1),et(" Simpan (Pending) ")]),8,Ve)])])]),_:1}))}}),We=Ot(Oe,[["__scopeId","data-v-050b14eb"]]);export{We as default};
